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
        try {

            await chrome.tabs.sendMessage(

                tab.id,

                {

                    action: "START_AUTOFILL"

                }

            );

            // Extension popup immediately close
            window.close();

            console.log("✅ Message Sent");

        } catch (error) {

            console.error("❌", error);

        }

        setTimeout(() => {

            window.close();

        }, 200);

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