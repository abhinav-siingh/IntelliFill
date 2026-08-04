let currentStep = 1;


const profileData = {

    personal: {

        firstName: "",
        lastName: "",

        gender: "",
        dob: "",

        fatherName: "",
        motherName: "",

        email: "",
        phone: "",
        declaration: true

    },

    address: {

        address: "",

        country: "",
        state: "",
        city: "",
        pinCode: ""

    },

    education: {

        tenthSchool: "",
        tenthBoard: "",
        tenthPassingYear: "",
        tenthPercentage: "",

        twelfthSchool: "",
        twelfthBoard: "",
        twelfthPassingYear: "",
        twelfthPercentage: "",

        graduationDegree: "",
        college: "",
        course: "",
        graduationYear: "",
        graduationPercentage: "",

        mastersDegree: "",
        mastersCollege: "",
        mastersYear: "",
        mastersPercentage: ""

    },

    professional: {

        currentStatus: "",

        preferredRole: "",

        skills: "",

        experience: "",

        preferredLocation: ""

    },

    social: {

        linkedin: "",

        github: "",

        portfolio: "",

        resume: ""

    }

};

async function autoSave() {
    await saveProfile(profileData);
}

const formContainer = document.getElementById("formContainer");
const stepText = document.getElementById("stepText");
const progressFill = document.getElementById("progressFill");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

function renderStep(errors = {}) {
    nextBtn.style.display = "inline-block";
    prevBtn.style.display = "inline-block";

    const step = steps[currentStep - 1];

    formContainer.innerHTML = generateForm(step, profileData, errors);



    prevBtn.style.display =
        currentStep === 1 ? "none" : "inline-block";

    nextBtn.textContent =
        currentStep === steps.length
            ? "Save Profile"
            : "Next";

    attachInputListeners();
    if (currentStep === 5) {
        loadSavedResume();
    }
    document.querySelectorAll(".navItem").forEach((item, index) => {

        item.classList.remove("active", "completed");

        if (index < currentStep - 1) {

            item.classList.add("completed");

        } else if (index === currentStep - 1) {

            item.classList.add("active");

        }

    });

    document.getElementById("stepTitle").textContent =
        steps[currentStep - 1].title;

    document.getElementById("stepSubtitle").textContent =
        `Step ${currentStep} of ${steps.length}`;

}
function openAIAssistant() {

    formContainer.innerHTML = renderAIAssistant();
    initializeAIAssistant();
    console.log("AI Assistant Initialized");
    // Header
    document.getElementById("stepTitle").textContent =
        "🤖 AI Assistant";

    document.getElementById("stepSubtitle").textContent =
        "Configure Gemini AI for intelligent autofill.";

    // Hide navigation buttons
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";

    // Active sidebar
    document.querySelectorAll(".navItem")
        .forEach(btn => btn.classList.remove("active", "completed"));

    document
        .getElementById("aiAssistantBtn")
        .classList.add("active");

}

function attachInputListeners() {

    const step = steps[currentStep - 1];

    step.fields.forEach(field => {

        // Resume field alag handle hoga
        if (field.type === "resume") {
            return;
        }

        const input = document.getElementById(field.id);

        if (!input) {
            return;
        }

        const saveField = async () => {

            profileData[step.section][field.id] = input.value;

            await autoSave();

        };

        input.addEventListener("input", saveField);
        input.addEventListener("change", saveField);

    });

    // Resume Upload Listener
    const resumeInput = document.getElementById("resumeFile");

    if (resumeInput) {

        resumeInput.addEventListener("change", async (event) => {

            const file = event.target.files[0];

            await handleResumeUpload(file);

        });

    }

}

nextBtn.addEventListener("click", () => {

    const result =
        Validation.validateStep(currentStep, profileData);

    if (!result.valid) {

        renderStep(result.errors);

        return;

    }

    if (currentStep < steps.length) {

        currentStep++;

        renderStep();

    } else {

        alert("Profile Saved Successfully");

        console.log(profileData);

    }

});
prevBtn.addEventListener("click", () => {

    if (currentStep > 1) {

        currentStep--;

        renderStep();

    }

});
document.querySelectorAll(".navItem").forEach(item => {

    item.addEventListener("click", () => {

        // AI Assistant
        if (item.id === "aiAssistantBtn") {

            formContainer.innerHTML = renderAIAssistant();
initializeAIAssistant();
            document.getElementById("stepTitle").textContent =
                "AI Assistant";

            document.getElementById("stepSubtitle").textContent =
                "Configure Gemini AI for intelligent autofill.";

            prevBtn.style.display = "none";
            nextBtn.style.display = "none";

           document.querySelectorAll(".navItem")
                .forEach(btn =>
                    btn.classList.remove("active", "completed")
                );

            item.classList.add("active");

            return;
        }

         if (!item.dataset.step) {
            return;
        }

        currentStep = Number(item.dataset.step) + 1;

        renderStep();

    });

});

async function initializeProfile() {

    const savedData = await loadProfile();

    if (savedData) {

        Object.assign(
            profileData.personal,
            savedData.personal || {}
        );


        Object.assign(
            profileData.address,
            savedData.address || {}
        );

        Object.assign(
            profileData.education,
            savedData.education || {}
        );
        Object.assign(
            profileData.professional,
            savedData.professional || {}
        );
        Object.assign(
            profileData.social,
            savedData.social || {}
        );

    }

    renderStep({});

}

initializeProfile();

openDatabase()
    .then(() => console.log("Database Connected"))
    .catch(console.error);
