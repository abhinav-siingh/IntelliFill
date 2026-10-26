// ==========================================
// Open Profile
// ==========================================

document
    .getElementById("profileBtn")
    .addEventListener("click", () => {

        chrome.tabs.create({

            url: chrome.runtime.getURL("profile.html")

        });

    });

// ==========================================
// Resume
// ==========================================

document
    .getElementById("resumeBtn")
    .addEventListener("click", () => {

        chrome.tabs.create({

            url: chrome.runtime.getURL("profile.html#resume")

        });

    });

// ==========================================
// Start Autofill
// ==========================================

document
    .getElementById("autofillBtn")
    .addEventListener("click", async () => {

        const button =
            document.getElementById("autofillBtn");

        // Disable Button
        button.disabled = true;

        // Loading State
        button.innerHTML = `

            ⏳

            <span>

                Scanning Current Page...

            </span>

        `;

        // Wait 1.5 sec
        await new Promise(resolve =>
            setTimeout(resolve, 1500)
        );

        // Active Tab
        const [tab] =
            await chrome.tabs.query({

                active: true,

                currentWindow: true

            });

        // Send Message
        // Send Message
        try {

            await chrome.tabs.sendMessage(

                tab.id,

                {

                    action: "START_AUTOFILL"

                }

            );

            console.log("✅ Message Sent");

            // Close popup after successful message
            setTimeout(() => {

                window.close();

            }, 200);

        } catch (error) {

            console.error("❌ Content script not available:", error);

            // Reset button if message fails
            button.innerHTML = `
        🤖
        <span>Start Autofill</span>
    `;

        }

    });
async function updateProfileProgress() {

    const result =
        await chrome.storage.local.get("intellifill_profile");

    const profile =
        result.intellifill_profile;

    const percentText =
        document.getElementById("profilePercent");

    const progressFill =
        document.querySelector(".progressFill");

    if (!profile) {

        if (percentText)
            percentText.textContent = "0% Complete";

        if (progressFill)
            progressFill.style.width = "0%";

        return;
    }

    const sections = [
        "personal",
        "address",
        "education",
        "professional",
        "social"
    ];

    let total = 0;
    let filled = 0;

    sections.forEach(section => {

        const data = profile[section] || {};

        Object.values(data).forEach(value => {

            total++;

            if (
                value !== null &&
                value !== undefined &&
                String(value).trim() !== ""
            ) {
                filled++;
            }

        });

    });

    const percentage =
        total === 0
            ? 0
            : Math.round((filled / total) * 100);

    if (percentText)
        percentText.textContent =
            `${percentage}% Complete`;

    if (progressFill)
        progressFill.style.width =
            `${percentage}%`;
}

updateProfileProgress();

// ==========================================
// Backend Auth (login / register / logout)
// ==========================================

async function refreshAuthUI() {

    const session = await loadAuthSession();

    const loginCard = document.getElementById("backendLoginCard");
    const loggedInCard = document.getElementById("backendLoggedInCard");
    const loggedInEmail = document.getElementById("loggedInEmail");

    if (session && session.token) {
        loginCard.style.display = "none";
        loggedInCard.style.display = "block";
        loggedInEmail.textContent = "🟢 " + (session.email || "Logged in");
    } else {
        loginCard.style.display = "block";
        loggedInCard.style.display = "none";
    }

}

document
    .getElementById("loginBtn")
    .addEventListener("click", async () => {

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        const errorEl = document.getElementById("loginError");

        errorEl.textContent = "";

        try {
            const result = await backendLogin(email, password);
            await saveAuthSession(result.token, result.user.email);
            await refreshAuthUI();
        } catch (error) {
            errorEl.textContent = error.message || "Login failed";
        }

    });

document
    .getElementById("registerBtn")
    .addEventListener("click", async () => {

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        const errorEl = document.getElementById("loginError");

        errorEl.textContent = "";

        try {
            // Uses the email's local part as a default name - the user can
            // change their name later once a "profile" section for account
            // details exists; this keeps the popup UI minimal for now.
            const name = email.split("@")[0] || "IntelliFill User";
            const result = await backendRegister(name, email, password);
            await saveAuthSession(result.token, result.user.email);
            await refreshAuthUI();
        } catch (error) {
            errorEl.textContent = error.message || "Registration failed";
        }

    });

document
    .getElementById("logoutBtn")
    .addEventListener("click", async () => {
        await clearAuthSession();
        await refreshAuthUI();
    });

refreshAuthUI();