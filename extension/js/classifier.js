
/**
 * ==========================================
 * IntelliFill Rule Classifier
 * Version : 7.0
 * ==========================================
 */

/**
 * AI Session Cache
 */

const aiFieldCache = new Map();

/**
 * Duplicate Unknown Field Cache
 */

const processedUnknownFields = new Set();

/**
 * AI Request Limiter
 */

let aiRequestCount = 0;

const MAX_AI_REQUESTS = 5;

/**
 * Reset AI Session
 * Call this once whenever a new page starts processing.
 */

function resetAISession() {

    aiRequestCount = 0;

    processedUnknownFields.clear();

}

/**
 * Normalize Text
 */

function normalizeText(text) {

    if (!text) return "";

    return String(text)
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

}

async function classifyField(field, aiSettings = null) {

    try {

        const searchableText = normalizeText([

            field.label || "",
            field.placeholder || "",
            field.name || "",
            field.id || ""

        ].join(" "));

        let bestMatch = {

            fieldType: "UNKNOWN",
            confidence: 0,
            source: "RULE_ENGINE"

        };

        // =====================================
        // Rule Engine
        // =====================================

        for (const [fieldType, keywords] of Object.entries(FIELD_RULES)) {

            for (const keyword of keywords) {

                const normalizedKeyword =
                    normalizeText(keyword);

                if (!normalizedKeyword) continue;

                if (searchableText.includes(normalizedKeyword)) {

                    const score =
                        normalizedKeyword.length;

                    if (score > bestMatch.confidence) {

                        bestMatch = {

                            fieldType,
                            confidence: score,
                            source: "RULE_ENGINE"

                        };

                    }

                }

            }

        }

        // =====================================
        // Rule Engine Success
        // =====================================

        if (bestMatch.fieldType !== "UNKNOWN") {

            return bestMatch;

        }

        // =====================================
        // Ignore Input Types
        // =====================================

        const ignoredTypes = [

            "password",
            "hidden",
            "checkbox",
            "submit",
            "button",
            "file"

        ];

        if (ignoredTypes.includes(field.type)) {

            return bestMatch;

        }

        // =====================================
        // Ignore Keywords
        // =====================================

        const ignoredKeywords = [

            "captcha",
            "recaptcha",
            "g-recaptcha",
            "otp",
            "verification code",
            "verification",
            "security code"

        ];

        if (

            ignoredKeywords.some(keyword =>

                searchableText.includes(keyword)

            )

        ) {

            return bestMatch;

        }

        // =====================================
        // Ignore Confirm Fields
        // =====================================

        const confirmKeywords = [

            "confirm",
            "confirmation",
            "retype",
            "re-type",
            "repeat",
            "again"

        ];

        if (

            confirmKeywords.some(keyword =>

                searchableText.includes(keyword)

            )

        ) {

            return bestMatch;

        }

        // =====================================
        // Empty Field
        // =====================================

        if (

            !field.label &&
            !field.placeholder &&
            !field.name &&
            !field.id

        ) {

            return bestMatch;

        }

        // =====================================
        // AI Disabled
        // =====================================
        //
        // Original rule: no personal Gemini key connected -> skip AI entirely.
        // New rule: if the user IS logged into the backend, they can still
        // get AI classification via the backend's shared key, even without
        // their own key connected - so we only apply the old strict check
        // when there's no backend session at all.

        const authSession = await loadAuthSession();
        const hasBackendSession = !!(authSession && authSession.token);

        if (
            !hasBackendSession &&
            (
                !aiSettings ||
                !aiSettings.connected ||
                !aiSettings.apiKey ||
                !aiSettings.model
            )
        ) {

            return bestMatch;

        }

        // =====================================
        // AI Cache
        // =====================================

        const cacheKey = searchableText;

        if (aiFieldCache.has(cacheKey)) {

            console.log("⚡ AI Cache Hit");

            return aiFieldCache.get(cacheKey);

        }

        // =====================================
        // Duplicate Unknown Field
        // =====================================

        if (processedUnknownFields.has(cacheKey)) {

            console.log("⏩ Duplicate Unknown Field");

            return bestMatch;

        }

        processedUnknownFields.add(cacheKey);

        // =====================================
        // Max AI Requests
        // =====================================

        if (aiRequestCount >= MAX_AI_REQUESTS) {

            console.warn("⚠ AI Request Limit Reached");

            return bestMatch;

        }

        aiRequestCount++;

        // =====================================
        // Debug
        // =====================================

        console.groupCollapsed("🤖 Gemini AI");

        console.table({

            Label: field.label,
            Placeholder: field.placeholder,
            Name: field.name,
            Id: field.id

        });

        // =====================================
        // Classification (Backend first, direct Gemini as fallback)
        // =====================================
        //
        // If the user is logged into the IntelliFill backend, we route
        // through it: it checks a PERMANENT shared cache first (so the
        // same field label is never re-classified, even across page
        // reloads or other users), then falls back to Gemini only on a
        // genuine cache miss. If the user hasn't logged in yet, we fall
        // back to the original direct-Gemini behavior unchanged.

        const aiResult = hasBackendSession
            ? await classifyFieldViaBackend(
                field,
                aiSettings?.apiKey,
                authSession.token
            )
            : await classifyUnknownField(
                field,
                aiSettings.apiKey,
                aiSettings.model
            );

        console.log("Classification Response", aiResult);

        // -------------------------------
        // Gemini Failed
        // -------------------------------

        if (!aiResult.success) {

            console.warn("❌ Gemini Request Failed");

            console.groupEnd();

            return bestMatch;

        }

        // -------------------------------
        // Normalize Response
        // -------------------------------

        const aiFieldType = String(aiResult.fieldType)
            .trim()
            .toUpperCase()
            .replace(/[^A-Z_]/g, "");

        // -------------------------------
        // Invalid Response
        // -------------------------------

        if (

            !aiFieldType ||

            aiFieldType === "UNKNOWN"

        ) {

            console.warn("⚠ Gemini Returned UNKNOWN");

            console.groupEnd();

            return bestMatch;

        }

        // -------------------------------
        // Success
        // -------------------------------

        const result = {

            fieldType: aiFieldType,

            confidence: 100,

            source: "GEMINI_AI"

        };

        // Save in Session Cache

        aiFieldCache.set(

            cacheKey,

            result

        );

        console.log("✅ AI Classified:", aiFieldType);

        console.groupEnd();

        return result;

    }

    catch (error) {

        console.error(

            "❌ classifyField Error",

            error

        );

        return {

            fieldType: "UNKNOWN",

            confidence: 0,

            source: "ERROR"

        };

    }

}



// catch (error) {

//     console.error("❌ classifyField Error", error);

//     return {

//         fieldType: "UNKNOWN",
//         confidence: 0,
//         source: "ERROR"

//     };

// }

