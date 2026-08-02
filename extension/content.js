/**
 * IntelliFill Content Script
 */

(async () => {

    console.log("🚀 IntelliFill Started");

    const loaded = await initializeProfile();

    if (!loaded) {
        console.warn("❌ Profile not found");
        return;
    }

    console.log("✅ Profile Loaded");

    // Process current page
    processCurrentPage();

    // Observe dynamically loaded forms
    observeFormChanges(() => {

        console.log("🔄 Dynamic Form Changed");

        processCurrentPage();

    });

})();

function processCurrentPage() {

    const fields = detectFormFields();

    if (!fields.length) {
        return;
    }

    const classifiedFields = fields.map(field => ({
        ...field,
        classification: classifyField(field)
    }));

    console.table(
    classifiedFields.map(field => ({
        Label: field.label,
        Name: field.name,
        Type: field.type,
        Classification: field.classification.fieldType,
        Value: getProfileValue(field.classification.fieldType)
    }))
);

    classifiedFields.forEach(field => {

        const fieldType = field.classification.fieldType;

        if (fieldType === "UNKNOWN") {
            return;
        }

        const value = getProfileValue(fieldType);

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return;
        }

       

        autofillField(
            field.element,
            value
        );

    });

}