/**
 * IntelliFill Rule Classifier
 * Version: 2.0
 */

function normalizeText(text) {

    if (!text) return "";

    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

}

function classifyField(field) {

    const searchableText = normalizeText(
        [
            field.label,
            field.placeholder,
            field.name,
            field.id
        ].join(" ")
    );

    // console.log("Searching:", searchableText);

    let bestMatch = {
        fieldType: "UNKNOWN",
        confidence: 0,
        source: "RULE_ENGINE"
    };

    for (const [fieldType, keywords] of Object.entries(FIELD_RULES)) {

        for (const keyword of keywords) {

            const normalizedKeyword = normalizeText(keyword);

            if (searchableText.includes(normalizedKeyword)) {

                // Longer keyword = better match
                const score = normalizedKeyword.length;

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

    // console.log("Result:", bestMatch);

    return bestMatch;

}