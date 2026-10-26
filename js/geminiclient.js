/**
 * ==========================================
 * IntelliFill Gemini Client
 * Version : 2.0
 * ==========================================
 */

const GEMINI_API_BASE =
    "https://generativelanguage.googleapis.com/v1beta";

/**
 * Dynamic Model Ranking
 * No hardcoded model names to maintain - Google deprecates and
 * introduces models often, so instead of a fixed list, we score
 * whatever models the API actually reports as available right now:
 *   - "-latest" aliases score highest, since Google keeps these
 *     pointed at their current recommended model automatically
 *   - "flash" models are preferred over "pro" (faster/cheaper,
 *     sufficient for simple field classification)
 *   - within the same tier, the highest version number wins
 */

function extractVersion(name) {

    const match = name.match(/(\d+(\.\d+)?)/);

    return match ? parseFloat(match[1]) : 0;

}

function rankModel(name) {

    let score = 0;

    if (name.includes("latest")) score += 1000;

    if (name.includes("flash")) score += 100;

    score += extractVersion(name);

    return score;

}

/**
 * Generic Gemini Request
 */

async function geminiRequest(

    endpoint,
    apiKey,
    options = {}

) {

    try {

        const response = await fetch(

            `${GEMINI_API_BASE}${endpoint}`,

            {

                headers: {

                    "Content-Type": "application/json",

                    "X-goog-api-key": apiKey

                },

                ...options

            }

        );

        const data = await response.json();

        return {

            success: response.ok,

            status: response.status,

            data

        };

    }

    catch (error) {

        console.error("Gemini Network Error:", error);

        return {

            success: false,

            status: 0,

            data: null

        };

    }

}
/**
 * Verify API Key
 */

async function verifyApiKey(apiKey) {

    const result =
        await geminiRequest(

            "/models",

            apiKey

        );

    if (!result.success) {

        return {

            success: false,

            message:

                result.data?.error?.message ||

                "Invalid API Key"

        };

    }

    return {

        success: true,

        models:

            result.data.models || []

    };

}
/**
 * Automatically Select Best Model
 * @param excludeModel - optionally skip a model that just failed
 *                        (used by the self-healing retry below)
 */

function selectBestModel(models, excludeModel = null) {

    const supportedModels =
        models.filter(model =>
            model.supportedGenerationMethods &&
            model.supportedGenerationMethods.includes(
                "generateContent"
            ) &&
            model.name.replace("models/", "") !== excludeModel
        );

    if (!supportedModels.length) return null;

    supportedModels.sort((a, b) =>
        rankModel(b.name.replace("models/", "")) -
        rankModel(a.name.replace("models/", ""))
    );

    return supportedModels[0].name.replace("models/", "");

}
/**
 * Test Gemini Connection
 */

async function testGeminiConnection(apiKey) {

    // ---------------------------
    // Step 1
    // Verify API Key
    // ---------------------------

    const verifyResult =
        await verifyApiKey(apiKey);

    if (!verifyResult.success) {

        return {

            success: false,

            message:
                verifyResult.message

        };

    }

    // ---------------------------
    // Step 2
    // Find Best Model
    // ---------------------------

    const model =
        selectBestModel(

            verifyResult.models

        );

    if (!model) {

        return {

            success: false,

            message:
                "No Supported Gemini Model Found"

        };

    }

    // ---------------------------
    // Step 3
    // Success
    // ---------------------------

    return {

        success: true,

        message:
            "🟢 Connected Successfully",

        model

    };

}
/**
 * Generate Content
 * Generic Gemini Function
 */

async function generateContent(
    apiKey,
    model,
    prompt
) {

    const result = await geminiRequest(

        `/models/${model}:generateContent`,

        apiKey,

        {

            method: "POST",

            body: JSON.stringify({

                contents: [

                    {

                        parts: [

                            {

                                text: prompt

                            }

                        ]

                    }

                ],

                generationConfig: {

                    temperature: 0

                }

            })

        }

    );

    if (!result.success) {

        console.error(

            "Gemini API Error",

            result.status,

            result.data

        );

        if (result.status === 429) {

            return {

                success: false,

                message: "RATE_LIMIT"

            };

        }

        if (result.status === 401) {

            return {

                success: false,

                message: "INVALID_API_KEY"

            };

        }

        if (result.status === 404) {

            return {

                success: false,

                message: "MODEL_UNAVAILABLE"

            };

        }

        if (result.status === 503) {

            return {

                success: false,

                message: "SERVER_OVERLOADED"

            };

        }

        return {

            success: false,

            message:

                result.data?.error?.message ||

                "Gemini Request Failed"

        };

    }

    try {

        const text =
            result.data
                .candidates[0]
                .content
                .parts[0]
                .text
                .trim();

        return {

            success: true,

            text

        };

    }

    catch {

        return {

            success: false,

            message:
                "Invalid Gemini Response"

        };

    }

}
/**
 * AI Field Classification
 */

async function classifyUnknownField(
    field,
    apiKey,
    model
) {

    const prompt = `

You are an AI Form Field Classification Engine.

Your job is to identify ONLY the field type.

Return ONLY ONE value.

Allowed Values:

FULL_NAME
FIRST_NAME
LAST_NAME
EMAIL
PHONE
DOB
GENDER
FATHER_NAME
MOTHER_NAME
ADDRESS
CITY
STATE
COUNTRY
PINCODE
COLLEGE
UNIVERSITY
SCHOOL
COURSE
DEGREE
SKILLS
LINKEDIN
GITHUB
PORTFOLIO
RESUME
EXPERIENCE
CURRENT_STATUS
PREFERRED_ROLE
PREFERRED_LOCATION
UNKNOWN

Field Details

Label:
${field.label}

Name:
${field.name}

Placeholder:
${field.placeholder}

HTML Type:
${field.type}

ID:
${field.id}

Return ONLY one value.
No explanation.
No punctuation.
No markdown.

`;

    let result = await generateContent(

        apiKey,

        model,

        prompt

    );

    // 503 = Google's servers are transiently overloaded (common with
    // newer "thinking" models under high demand) - NOT a real failure.
    // Retry a couple of times with a short pause before giving up.


    // Self-healing: the saved model may have been deprecated by Google
    // since it was last selected (this happens more often than you'd
    // expect). Instead of failing, re-check what's actually available
    // right now, pick a fresh model, and retry once.
    if (!result.success && result.message === "MODEL_UNAVAILABLE") {

        console.warn(`Model "${model}" is no longer available - re-selecting automatically...`);

        const verifyResult = await verifyApiKey(apiKey);

        if (verifyResult.success) {

            const newModel = selectBestModel(verifyResult.models, model);

            if (newModel) {

                result = await generateContent(apiKey, newModel, prompt);

                if (result.success) {
                    // Persist so the next call uses the working model directly,
                    // without needing to fail-and-retry every time.
                    const currentSettings = await loadAISettings();
                    await saveAISettings({ ...currentSettings, model: newModel });
                    console.log(`✅ Switched to available model: ${newModel}`);
                }

            }

        }

    }

    if (!result.success) {

        return {

            success: false,

            fieldType: "UNKNOWN"

        };

    }

    return {

        success: true,

        fieldType: result.text
            .trim()
            .toUpperCase()
            .replace(/[^A-Z_]/g, "")
    };

}