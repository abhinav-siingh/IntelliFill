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