/**
 * IntelliFill Content Script
 * Version: 2.0
 */

(async () => {

    console.log("🚀 IntelliFill Started");

    const loaded = await initializeProfile();

    if (!loaded) {

        console.warn("❌ Profile not found");

        return;

    }

    console.log("✅ Profile Loaded");

    // Initial Scan
    await processCurrentPage();

    // Observe Dynamic Forms
    observeFormChanges(async () => {

        console.log("🔄 Dynamic Form Changed");

        await processCurrentPage();

    });

})();

/**
 * Scan Current Page
 */

async function processCurrentPage() {

    const fields = detectFormFields();
    const aiSettings =
        await loadAISettings();

    console.log("AI SETTINGS", aiSettings);
    if (!fields.length) {

        console.log("No Form Fields Found");

        return;

    }

    const classifiedFields = [];

    // ============================
    // Classify Fields
    // ============================

    for (const field of fields) {

        const classification =
            await classifyField(

                field,

                aiSettings

            );
        classifiedFields.push({

            ...field,

            classification

        });

    }

    // ============================
    // Debug Table
    // ============================

    console.table(

        classifiedFields.map(field => ({

            Label: field.label,

            Name: field.name,

            Placeholder: field.placeholder,

            HTMLType: field.type,

            Classification:
                field.classification.fieldType,

            Source:
                field.classification.source,

            Value:
                getProfileValue(
                    field.classification.fieldType
                )

        }))

    );

    // ============================
    // Autofill
    // ============================

    for (const field of classifiedFields) {

        const fieldType =
            field.classification.fieldType;

        if (fieldType === "UNKNOWN") {

            continue;

        }

        const value =
            getProfileValue(fieldType);

        if (

            value === null ||

            value === undefined ||

            value === ""

        ) {

            continue;

        }

        autofillField(

            field.element,

            value

        );

        console.log(

            `✅ Filled ${fieldType}`,

            value

        );

    }

    console.log(

        `🎉 IntelliFill Completed (${classifiedFields.length} fields)`

    );

}