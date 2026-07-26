function generateForm(step, profileData, errors = {}) {

    let html = `
<div class="formSection">

    <div class="sectionHeader">

        <h2>${step.title}</h2>

        <p>Complete this section carefully.</p>

    </div>

    <div class="formGrid">
`;

    step.fields.forEach(field => {

        if (field.type === "resume") {

            html += `

    <div class="input-group full">

        <label>${field.label}</label>

<label class="resume-upload-card" for="resumeFile">
            <div class="upload-icon">📄</div>

            <h3>Upload Your Resume</h3>

            <p>
                Drag & Drop your PDF here
                <br>
                or
                <span class="browse-text">Browse File</span>
            </p>

            <small>PDF • Maximum Size 2 MB</small>

            <input
                type="file"
                id="resumeFile"
                accept=".pdf"
                hidden
            >

        </label>

        <div id="resumeInfo"></div>

    </div>

    `;

            return;
        }
        if (field.type === "review") {

            html += generateReview(profileData);

            return;

        }

        const value = profileData[step.section][field.id] || "";
        const error = errors[field.id] || "";

        const halfWidth = [

            // Personal
            "firstName",
            "lastName",

            // Address
            "country",
            "state",
            "city",
            "pinCode",

            // Education
            "dob",

            "tenthBoard",
            "tenthPassingYear",
            "tenthPercentage",

            "twelfthBoard",
            "twelfthPassingYear",
            "twelfthPercentage",

            "graduationDegree",
            "graduationYear",
            "graduationPercentage",

            "mastersDegree",
            "mastersYear",
            "mastersPercentage",

            // Professional
            "currentStatus",
            "preferredRole",
            "experience",
            "preferredLocation"

        ].includes(field.id);

        html += `
<div class="input-group ${halfWidth ? "half" : "full"}">

                <label for="${field.id}">
                    ${field.label}
                </label>

                <input
                    type="${field.type}"
                    id="${field.id}"
                    name="${field.id}"
                    placeholder="${field.placeholder || ""}"
                    value="${value}"
                    class="${error ? "input-error" : ""}"
                    autocomplete="off"
                    maxlength="${field.maxlength || ""}"
                >

                <div class="error-message">
                    ${error}
                </div>

            </div>
        `;

    });

    html += `
    </div>
</div>
`;

    return html;

}
function generateReview(profileData) {

    return `

<div class="review-page">

<h2>Review Your Profile</h2>

<div class="review-card">

<h3>👤 Personal Information</h3>

<p><b>First Name:</b> ${profileData.personal.firstName}</p>

<p><b>Last Name:</b> ${profileData.personal.lastName}</p>

<p><b>Email:</b> ${profileData.personal.email}</p>

<p><b>Phone:</b> ${profileData.personal.phone}</p>

</div>

</div>

`;

}
function reviewRow(label, value) {

    const filled =
        value !== undefined &&
        value !== null &&
        value.toString().trim() !== "";

    return `

    <div class="review-row">

        <div class="review-label">
            ${label}
        </div>

        <div class="${filled ? "review-success" : "review-error"}">

            ${filled ? "✔ " + value : "❌ Not Filled"}

        </div>

    </div>

    `;

}
function reviewCard(title, rows){

    return `

    <div class="review-card">

        <h3>${title}</h3>

        ${rows}

    </div>

    `;

}
function generateReview(profileData){

    return `

<div class="review-page">

<h2>Review Your Profile</h2>

<p class="review-subtitle">

Please verify your information before saving.

</p>

${reviewCard(

"👤 Personal Information",

reviewRow("First Name",profileData.personal.firstName)+
reviewRow("Last Name",profileData.personal.lastName)+
reviewRow("Email",profileData.personal.email)+
reviewRow("Mobile",profileData.personal.phone)

)}

${reviewCard(

"📍 Address",

reviewRow("Country",profileData.address.country)+
reviewRow("State",profileData.address.state)+
reviewRow("City",profileData.address.city)+
reviewRow("PIN Code",profileData.address.pinCode)

)}

${reviewCard(

"🎓 Education",

reviewRow("Date of Birth",profileData.education.dob)+
reviewRow("10th School",profileData.education.tenthSchool)+
reviewRow("10th Board",profileData.education.tenthBoard)+
reviewRow("10th %",profileData.education.tenthPercentage)+
reviewRow("12th School",profileData.education.twelfthSchool)+
reviewRow("12th Board",profileData.education.twelfthBoard)+
reviewRow("12th %",profileData.education.twelfthPercentage)+
reviewRow("Graduation Degree",profileData.education.graduationDegree)+
reviewRow("Graduation College",profileData.education.college)+
reviewRow("Graduation %",profileData.education.graduationPercentage)+
reviewRow("Masters Degree",profileData.education.mastersDegree)+
reviewRow("Masters College",profileData.education.mastersCollege)+
reviewRow("Masters %",profileData.education.mastersPercentage)

)}

${reviewCard(

"💼 Professional",

reviewRow("Current Status",profileData.professional.currentStatus)+
reviewRow("Preferred Role",profileData.professional.preferredRole)+
reviewRow("Skills",profileData.professional.skills)+
reviewRow("Experience",profileData.professional.experience)+
reviewRow("Preferred Location",profileData.professional.preferredLocation)

)}

${reviewCard(

"🌐 Social",

reviewRow("LinkedIn",profileData.social.linkedin)+
reviewRow("GitHub",profileData.social.github)+
reviewRow("Portfolio",profileData.social.portfolio)

)}

${reviewCard(

"📄 Resume",

reviewRow("Resume",uploadedResume ? uploadedResume.name : "")

)}

</div>

`;

}