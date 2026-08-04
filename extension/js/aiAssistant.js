/**
 * IntelliFill AI Assistant
 * Version: 1.0
 */

function renderAIAssistant() {

    return `

    <div class="aiAssistantPage">

        <div class="aiHero">

            <h2>🤖 Connect Your Gemini API To IntelliFill</h2>

            <p>
                Enable AI-powered smart field detection with a one-time setup.
            </p>

        </div>

        <div class="aiCard">

            <h3>🚀 One-Time Setup</h3>

            <p>
                Setup Gemini AI once and IntelliFill will intelligently detect unknown fields.
            </p>

        </div>

        <div class="aiCard">

            <h3>Step 1</h3>

            <p>Get your FREE Gemini API Key</p>

            <button id="getApiKeyBtn" class="primaryBtn">
                Get Free API Key
            </button>

        </div>

        <div class="aiCard">

            <h3>Step 2</h3>

            <label>Gemini API Key</label>

            <input
                id="geminiApiKey"
                type="password"
                placeholder="Paste your Gemini API Key"
            >

        </div>

        <div class="aiActions">

            <button id="testConnectionBtn">
                Test Connection
            </button>

            <button id="saveApiKeyBtn" class="primaryBtn">
                Save Settings
            </button>

        </div>

        <div
    id="aiStatus"
    class="aiStatus">

    🔴 Not Connected

</div>

        <div id="toast"></div>

    </div>

    `;

}

/**
 * Initialize AI Assistant
 */

async function initializeAIAssistant() {

    const settings = await loadAISettings();

    const apiKeyInput =
        document.getElementById("geminiApiKey");

    if (!apiKeyInput) return;

    apiKeyInput.value = settings.apiKey || "";

    // ===========================
    // Get Free API Key
    // ===========================

    const getApiKeyBtn =
        document.getElementById("getApiKeyBtn");

    getApiKeyBtn.addEventListener("click", () => {

        window.open(
            "https://aistudio.google.com/app/apikey",
            "_blank"
        );

    });

    // ===========================
    // Save Settings
    // ===========================

    const saveBtn =
        document.getElementById("saveApiKeyBtn");

   saveBtn.addEventListener("click", async () => {

    const apiKey =
        apiKeyInput.value.trim();

    if (!apiKey) {

        showToast("❌ Please Enter API Key");

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

    showToast("✅ API Key Saved");

});

    // ===========================
// Test Connection
// ===========================

const testBtn =
    document.getElementById("testConnectionBtn");

const status =
    document.getElementById("aiStatus");

testBtn.addEventListener("click", async () => {

    const apiKey =
        apiKeyInput.value.trim();

    if (!apiKey) {

        showToast("❌ Please Enter API Key");

        return;

    }

    // Loading State
    testBtn.disabled = true;
    testBtn.textContent = "Testing...";

    status.textContent = "🟡 Connecting...";

    const result =
        await testGeminiConnection(apiKey);

    // Restore Button
    testBtn.disabled = false;
    testBtn.textContent = "Test Connection";

    // Success
    if (result.success) {

        status.textContent =
            "🟢 Connected";

        await saveAISettings({

            apiKey: apiKey,

            connected: true,

            model: result.model

        });

        showToast(result.message);

    }

    // Failed
    else {

        status.textContent =
            "🔴 Not Connected";

        showToast(result.message);

    }

});
}

/**
 * Toast Notification
 */

function showToast(message) {

    const toast =
        document.getElementById("toast");

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}