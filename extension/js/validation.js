// ===============================
// IntelliFill Validation Engine
// ===============================

const Validation = {

    validateRequired(value) {
        return value.trim() !== "";
    },

    validateEmail(email) {
        const regex =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

        return regex.test(email);
    },

    validatePhone(phone) {

        const cleaned = phone.replace(/\D/g, "");

        return /^[6-9]\d{9}$/.test(cleaned);

    },

    validatePincode(pin) {

        return /^\d{6}$/.test(pin);

    },

    validateURL(url) {

        if (url.trim() === "") return true;

        try {

            new URL(url);

            return true;

        } catch {

            return false;

        }

    },

    validateStep(stepId, profileData) {

        let errors = {};

        switch (stepId) {

            case 1:

                if (!this.validateRequired(profileData.personal.firstName))
                    errors.firstName = "First Name is required.";

                if (!this.validateRequired(profileData.personal.lastName))
                    errors.lastName = "Last Name is required.";

                if (!this.validateEmail(profileData.personal.email))
                    errors.email = "Enter a valid Email.";

                if (!this.validatePhone(profileData.personal.phone))
                    errors.phone = "Enter a valid Mobile Number.";

                break;

            case 2:

                if (!this.validateRequired(profileData.address.country))
                    errors.country = "Country is required.";

                if (!this.validateRequired(profileData.address.state))
                    errors.state = "State is required.";

                if (!this.validateRequired(profileData.address.city))
                    errors.city = "City is required.";

                if (!this.validatePincode(profileData.address.pinCode))
                    errors.pinCode = "Invalid PIN Code.";

                break;
                case 4:

    if (!this.validateRequired(profileData.professional.currentStatus))
        errors.currentStatus = "Current Status is required.";

    if (!this.validateRequired(profileData.professional.preferredRole))
        errors.preferredRole = "Preferred Job Role is required.";

    if (!this.validateRequired(profileData.professional.skills))
        errors.skills = "Skills are required.";

    if (!this.validateRequired(profileData.professional.experience))
        errors.experience = "Experience Level is required.";

    if (!this.validateRequired(profileData.professional.preferredLocation))
        errors.preferredLocation = "Preferred Location is required.";

    break;
    case 5:

    if (!this.validateURL(profileData.social.linkedin))
        errors.linkedin = "Invalid LinkedIn URL.";

    if (!this.validateURL(profileData.social.github))
        errors.github = "Invalid GitHub URL.";

    if (!this.validateURL(profileData.social.portfolio))
        errors.portfolio = "Invalid Portfolio URL.";

    break;

        }

        return {

            valid: Object.keys(errors).length === 0,

            errors

        };

    }

};