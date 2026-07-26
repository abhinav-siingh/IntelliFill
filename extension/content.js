(async () => {

    console.log("🚀 IntelliFill Started");

    // ============================
    // Load Profile
    // ============================

    const loaded = await initializeProfile();

    if (!loaded) {
        console.warn("❌ Profile not found");
        return;
    }

    console.log("✅ Profile Loaded");

    console.table(getProfile());

    // ============================
    // Detect Fields
    // ============================

    const fields = detectFormFields();

    // ============================
    // Classify Fields
    // ============================

    const classifiedFields = fields.map(field => ({
        ...field,
        classification: classifyField(field)
    }));

    // ============================
    // Show Classification
    // ============================

    console.table(
        classifiedFields.map(field => ({
            Label: field.label,
            Name: field.name,
            Type: field.type,
            Classification: field.classification.fieldType,
            Confidence: field.classification.confidence
        }))
    );

    // ============================
    // Mapper Test
    // ============================

    console.log("========== Mapper Test ==========");

    classifiedFields.forEach(field => {

        const value = getProfileValue(field.classification.fieldType);

        console.log(
            `${field.classification.fieldType} =>`,
            value
        );

    });

    // ============================
    // Autofill Test (FIRST_NAME & LAST_NAME only)
    // ============================

    console.log("========== Autofill Test ==========");

    classifiedFields.forEach(field => {

        if (
            field.classification.fieldType === "FIRST_NAME" ||
            field.classification.fieldType === "LAST_NAME"
        ) {

            const value = getProfileValue(
                field.classification.fieldType
            );

            if (value) {

                autofillField(
                    field.element,
                    value
                );

                console.log(
                    `✅ Filled ${field.classification.fieldType} : ${value}`
                );

            }

        }

    });

    // ============================
    // Observe Dynamic Forms
    // ============================

    observeFormChanges();

})();