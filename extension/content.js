console.log("Content Loaded");

const fields = detectFormFields();

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
        Confidence: field.classification.confidence
    }))
);

observeFormChanges();