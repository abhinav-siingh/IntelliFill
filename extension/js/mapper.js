/**
 * IntelliFill Value Mapper
 * Version: 2.1
 */

function getProfileValue(fieldType) {

    const profile = getProfile();

    if (!profile) {
        return null;
    }

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

        case "PINCODE":
            return profile.address?.pinCode || profile.address?.pincode || null;

        default:
            return null;
    }

}