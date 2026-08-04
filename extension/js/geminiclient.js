/**
 * ==========================================
 * IntelliFill Gemini Client
 * Version : 2.0
 * ==========================================
 */

const GEMINI_API_BASE =
    "https://generativelanguage.googleapis.com/v1beta";

/**
 * Preferred Models
 * IntelliFill will automatically choose
 * the best available model.
 */
const PREFERRED_MODELS = [

    "gemini-2.5-flash",

    "gemini-flash-latest",

    "gemini-2.5-pro",

    "gemini-2.0-flash"

];

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
 */

function selectBestModel(models) {

    const names =
        models.map(model =>

            model.name.replace("models/", "")

        );

    for (const preferred of PREFERRED_MODELS) {

        if (names.includes(preferred)) {

            return preferred;

        }

    }

    return names.length
        ? names[0]
        : null;

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

                ]

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

    const result = await generateContent(

        apiKey,

        model,

        prompt

    );

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