/**
 * ==========================================
 * IntelliFill AI Assistant
 * Version : 3.0
 * ==========================================
 */

/**
 * Render AI Assistant
 */

function renderAIAssistant() {

    return `

    <div class="aiAssistantPage">

        <!-- =======================================
                Hero
        ======================================== -->

        <section class="aiHero">

            <div class="heroIcon">

                🤖

            </div>

            <div class="heroContent">

                <h2>

                    AI Assistant

                </h2>

                <p>

                    Enable AI-powered smart field detection with Google Gemini.

                </p>

                <span class="heroBadge">

                    One-time setup • Secure • Free Gemini API

                </span>

            </div>

        </section>

        <!-- =======================================
                Free API Banner
        ======================================== -->

        <section class="apiBanner">

            <div class="bannerIcon">

                ⚡

            </div>

            <div class="bannerText">

                <h3>

                    Get your FREE API Key in 1 minute

                </h3>

                <p>

                    Click The Button Given Below [Get API Key] ==> Generate Gemini API Key ==> Copy the API link ==> Now Paste It Inside IntelliFill API Section Below .

                </p>

            </div>

        </section>

        <!-- =======================================
                Main Card
        ======================================== -->

        <section class="aiMainCard">

            <!-- API KEY -->

            <div class="sectionHeader">

                <h3>

                    🔑 Gemini API Key

                </h3>

                <span>

                    Required only once

                </span>

            </div>

            <p class="sectionDescription">

                Paste Your Generated API Here ==> Then Click On [Test Connection] if connection is successful ==> Save Setting 

            </p>

            <div class="apiInputWrapper">

                <input

                    id="geminiApiKey"

                    type="password"

                    placeholder="Paste your Gemini API Key"

                >

                <button

                    id="toggleApiKey"

                    class="iconBtn"

                    title="Show / Hide API Key">

                    👁

                </button>

            </div>

            <small class="inputInfo">

                🔒 IntelliFill never uploads your API Key anywhere.

            </small>
                        <!-- =======================================
                    Action Buttons
            ======================================== -->

            <div class="actionSection">

                <div class="actionTitle">

                    Quick Setup

                </div>

               <div class="buttonRow">

    <button
        id="getApiKeyBtn"
        class="btn getKeyBtn">

        <span>🔑</span>
        <span>Get API Key</span>

    </button>

    <button
        id="testConnectionBtn"
        class="btn testBtn">

        <span>🔌</span>
        <span>Test Connection</span>

    </button>

    <button
        id="saveApiKeyBtn"
        class="btn saveBtn">

        <span>💾</span>
        <span>Save Settings</span>

    </button>

</div>

            </div>

            <!-- =======================================
                    Connection Status
            ======================================== -->

            <div
                id="statusContainer"
                class="statusCard">

                <div class="statusLeft">

                    <div
                        id="statusIcon"
                        class="statusIcon">

                        🛡️

                    </div>

                    <div>

                        <h3
                            id="aiStatus">

                            Not Connected

                        </h3>

                        <p
                            id="statusDescription">

                            Connect your Gemini API to unlock AI-powered field detection.

                        </p>

                    </div>

                </div>

                <div
                    id="modelBadge"
                    class="modelBadge">

                    Gemini

                </div>

            </div>

            <!-- =======================================
                    Help Section
            ======================================== -->

            <div class="helpSection">

                <div class="helpCard">

                    <div class="helpIcon">

                        📖

                    </div>

                    <div class="helpContent">

                        <h4>

                            Setup Guide

                        </h4>

                        <p>

                            Learn how to generate and connect your Gemini API Key.

                        </p>

                    </div>

                    <button

                        id="setupGuideBtn"

                        class="helpAction">

                        Open

                    </button>

                </div>

                <div class="helpCard">

                    <div class="helpIcon">

                        🎥

                    </div>

                    <div class="helpContent">

                        <h4>

                            Watch 2-Minute Video

                        </h4>

                        <p>

                            Follow the complete setup tutorial step-by-step.

                        </p>

                    </div>

                    <button

                        id="watchVideoBtn"

                        class="helpAction">

                        Watch

                    </button>

                </div>

            </div>
                        <!-- =======================================
                    Footer
            ======================================== -->

            <div class="footerNote">

                <div class="footerIcon">

                    🔒

                </div>

                <div>

                    IntelliFill stores your API Key securely on your device.
                    Your API Key is never shared or uploaded to our servers.

                </div>

            </div>

        </section>

        <!-- =======================================
                Toast Notification
        ======================================== -->

        <div
            id="toast"
            class="toast">

        </div>

    </div>

    `;

}
/**
 * ==========================================
 * Initialize AI Assistant
 * ==========================================
 */

async function initializeAIAssistant() {

    const settings =
        await loadAISettings();

    const apiKeyInput =
        document.getElementById("geminiApiKey");

    const status =
        document.getElementById("aiStatus");

    const statusDescription =
        document.getElementById("statusDescription");

    const modelBadge =
        document.getElementById("modelBadge");

    const toggleBtn =
        document.getElementById("toggleApiKey");

    if (
        !apiKeyInput ||
        !status
    ) {
        return;
    }


    // =====================================
    // Restore Saved Settings
    // =====================================

    apiKeyInput.value =
        settings.apiKey || "";

    if (settings.connected) {

        status.textContent =
            "Gemini AI Connected";

        status.style.color =
            "#16A34A";

        if (statusDescription) {

            statusDescription.textContent =
                "Your Google Gemini is ready for intelligent field detection.";

        }

        if (modelBadge) {

            modelBadge.textContent =
                settings.model || "Gemini";

        }

    }

    else {

        status.textContent =
            "Not Connected";

        status.style.color =
            "#DC2626";

        if (statusDescription) {

            statusDescription.textContent =
                "Connect your Gemini API to unlock AI-powered field detection.";

        }

        if (modelBadge) {

            modelBadge.textContent =
                "Offline";

        }

    }

    console.log(
        "AI Settings Loaded",
        settings
    );

    // =====================================
    // Show / Hide API Key
    // =====================================

    if (toggleBtn) {

        toggleBtn.addEventListener("click", () => {

            if (
                apiKeyInput.type === "password"
            ) {

                apiKeyInput.type = "text";

                toggleBtn.textContent =
                    "🙈";

            }

            else {

                apiKeyInput.type =
                    "password";

                toggleBtn.textContent =
                    "👁";

            }

        });

    }
    // =====================================
    // Get Free API Key
    // =====================================

   // ===========================
// Get Free API Key
// ===========================

const getApiKeyBtn =
    document.getElementById("getApiKeyBtn");

if (getApiKeyBtn) {

    getApiKeyBtn.addEventListener("click", () => {

        chrome.tabs.create({

            url:
                "https://aistudio.google.com/app/apikey"

        });

    });

}

    // =====================================
    // Save Settings
    // =====================================

    document
        .getElementById("saveApiKeyBtn")
        ?.addEventListener("click", async () => {

            const apiKey =
                apiKeyInput.value.trim();

            if (!apiKey) {

                showToast(
                    "Please enter your Gemini API Key."
                );

                return;

            }

            const oldSettings =
                await loadAISettings();

            await saveAISettings({

                apiKey,

                connected:
                    oldSettings.connected,

                model:
                    oldSettings.model

            });

            showToast(
                "Settings saved successfully."
            );

        });

    // =====================================
    // Test Connection
    // =====================================

    document
        .getElementById("testConnectionBtn")
        ?.addEventListener("click", async () => {

            const apiKey =
                apiKeyInput.value.trim();

            if (!apiKey) {

                showToast(
                    "Please enter your Gemini API Key."
                );

                return;

            }

            const button =
                document.getElementById(
                    "testConnectionBtn"
                );

            button.disabled = true;

            button.innerHTML =
                "⏳ Testing...";

            status.textContent =
                "Connecting...";

            const result =
                await testGeminiConnection(
                    apiKey
                );

            button.disabled = false;

            button.innerHTML =
                "🔌 Test";

            if (result.success) {

                await saveAISettings({

                    apiKey,

                    connected: true,

                    model: result.model

                });

                status.textContent =
                    "Connected Successfully";

                status.style.color =
                    "#16A34A";

                if (statusDescription) {

                    statusDescription.textContent =
                        "Gemini API is ready for intelligent field detection.";

                }

                if (modelBadge) {

                    modelBadge.textContent =
                        result.model;

                }

                showToast(
                    "Gemini connected successfully."
                );

            }

            else {

                await saveAISettings({

                    apiKey,

                    connected: false,

                    model: ""

                });

                status.textContent =
                    "Not Connected";

                status.style.color =
                    "#DC2626";

                if (statusDescription) {

                    statusDescription.textContent =
                        result.message;

                }

                if (modelBadge) {

                    modelBadge.textContent =
                        "Offline";

                }

                showToast(
                    result.message
                );

            }

        });

// ===========================
// Setup Guide
// ===========================

const setupGuideBtn =
    document.getElementById("setupGuideBtn");

if (setupGuideBtn) {

    setupGuideBtn.addEventListener("click", () => {

        chrome.tabs.create({

            url:
                "https://www.getmaxim.ai/bifrost/guides/api-keys/how-to-get-a-gemini-api-key"

        });

    });

}

// ===========================
// Watch 2-Minute Video
// ===========================

const watchVideoBtn =
    document.getElementById("watchVideoBtn");

if (watchVideoBtn) {

    watchVideoBtn.addEventListener("click", () => {

        window.open(

            "https://www.youtube.com/watch?v=prrb0hsfI60",

            "_blank"

        );

    });

}
}
/**
 * Toast Notification
 */

function showToast(message) {

    const toast =
        document.getElementById("toast");

    if (!toast) return;

    toast.textContent =
        message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}