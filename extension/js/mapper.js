/**
 * IntelliFill Value Mapper
 * Version: 2.0
 */

function getProfileValue(fieldType) {

    const profile = getProfile();

    if (!profile) {
        return null;
    }

    switch (fieldType) {

        case "FULL_NAME":
            return `${profile.personal.firstName} ${profile.personal.lastName}`;

        case "FIRST_NAME":
            return profile.personal.firstName;

        case "LAST_NAME":
            return profile.personal.lastName;

        case "EMAIL":
            return profile.personal.email;

        case "PHONE":
            return profile.personal.phone;

        case "DOB":
            return profile.personal.dob;

        case "GENDER":
            return profile.personal.gender;

        case "ADDRESS":
            return profile.address.address;

        case "CITY":
            return profile.address.city;

        case "STATE":
            return profile.address.state;

        case "COUNTRY":
            return profile.address.country;

        case "PINCODE":
            return profile.address.pinCode;

        default:
            return null;

    }

}