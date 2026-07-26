// =======================================
// IntelliFill Resume Manager
// =======================================

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPE = "application/pdf";

let uploadedResume = null;

async function handleResumeUpload(file) {

    if (!file) return;

    if (file.type !== ALLOWED_TYPE) {
        alert("Only PDF files are allowed.");
        return;
    }

    if (file.size > MAX_FILE_SIZE) {
        alert("Maximum file size is 2 MB.");
        return;
    }


    const arrayBuffer = await file.arrayBuffer();

    uploadedResume = {
        id: "resume",
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        data: arrayBuffer
    };

    await saveResume(uploadedResume);

    showResumeInfo(uploadedResume);
}

function showResumeInfo(resume) {

    console.log("showResumeInfo called", resume);

    const resumeInfo = document.getElementById("resumeInfo");

    console.log("resumeInfo element:", resumeInfo);


    if (!resumeInfo) return;

    const sizeKB = (resume.size / 1024).toFixed(1);

    resumeInfo.innerHTML = `
    
    <div class="resume-card">

        <div class="resume-header">

            <div class="resume-file-icon">📄</div>

            <div class="resume-details">

                <h4>${resume.name}</h4>

                <p>${sizeKB} KB • Uploaded Successfully</p>

            </div>

        </div>

        <div class="resume-actions">

            <button id="previewResume">👁 Preview</button>

            <button id="replaceResume">🔄 Replace</button>

            <button id="deleteResume">🗑 Delete</button>

        </div>

    </div>

    `;

    const uploadCard = document.getElementById("resumeUploadCard");

    if (uploadCard) {

        uploadCard.style.display = "none";

    }

    document
        .getElementById("previewResume")
        .addEventListener("click", () => {

            const blob = new Blob(
                [new Uint8Array(resume.data)],
                { type: "application/pdf" }
            );


            const url = URL.createObjectURL(blob);

            window.open(url, "_blank");

        });

    document
        .getElementById("replaceResume")
        .addEventListener("click", () => {

            const input = document.getElementById("resumeFile");

            if (input) {

                input.value = "";

                input.click();

            }

        });

    document
        .getElementById("deleteResume")
        .addEventListener("click", async () => {

            await deleteResume();

            if (uploadCard) {

                uploadCard.style.display = "block";

            }

            resumeInfo.innerHTML = "";

        });

}

async function loadSavedResume() {

    const resume = await loadResume();

    if (!resume) return;

    uploadedResume = resume;

    showResumeInfo(resume);

}
