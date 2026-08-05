/**
 * IntelliFill Content Script
 * Version: 2.0
 */
let permissionPopupActive = false;

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
    // Ask User Permission
    // ============================

    // Another scan is already waiting for user response
    if (permissionPopupActive) {

        console.log("⏳ Permission popup already active");

        return;

    }

    permissionPopupActive = true;

    console.log("🔔 Showing autofill permission popup");

    const shouldAutofill =
        await showAutofillPermission();

    permissionPopupActive = false;

    if (!shouldAutofill) {

        console.log("❌ User cancelled autofill");

        return;

    }

    console.log("✅ User approved autofill");

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