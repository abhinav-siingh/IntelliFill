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