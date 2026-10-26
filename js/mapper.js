/**
 * IntelliFill Value Mapper
 * Version: 2.1
 */

function getProfileValue(fieldType, field = null) {

    const profile = getProfile();

    // Exact course-context matches only. Conflicting records produce no value.
    const label = String(field?.label || field?.name || field?.id || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    let extraPath = null;
    if (/^(class 10|class x|10th) (admission|registration) (number|no)$/.test(label)) extraPath = "education.class10.admissionNumber";
    if (/^(class 12|class xii|12th) (admission|registration) (number|no)$/.test(label)) extraPath = "education.class12.admissionNumber";
    if (extraPath) {
        const values = [...new Set((EXTRA_DOCUMENT_RECORDS || []).map(record => record.fields?.[extraPath]).filter(Boolean))];
        return values.length === 1 ? values[0] : null;
    }
    if (!profile) return null;

    switch (fieldType) {

        case "FULL_NAME":
            return `${profile.personal?.firstName || ""} ${profile.personal?.lastName || ""}`.trim();

        case "FIRST_NAME":
            return profile.personal?.firstName || null;

        case "LAST_NAME":
            return profile.personal?.lastName || null;

        case "EMAIL":
            return profile.personal?.email || null;

        case "PHONE":
            return profile.personal?.phone || null;

        case "DOB":
            return profile.personal?.dob || null;

        case "GENDER":
            return profile.personal?.gender || null;

        case "DECLARATION":
            return true;

        case "FATHER_NAME":
            return profile.personal?.fatherName || null;

        case "MOTHER_NAME":
            return profile.personal?.motherName || null;

        case "ADDRESS":
            return profile.address?.address || null;

        case "CITY":
            return profile.address?.city || null;

        case "STATE":
            return profile.address?.state || null;

        case "COUNTRY":
            return profile.address?.country || null;

        case "MARITAL_STATUS":
            return profile.personal?.maritalStatus || null;

        case "CATEGORY":
            return profile.personal?.category || null;

        case "HIGHEST_QUALIFICATION":
            return profile.education?.highestQualification || null;

        case "PINCODE":
            return profile.address?.pinCode || profile.address?.pincode || null;

        default:
            return null;
    }

}
