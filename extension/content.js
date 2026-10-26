/**
 * IntelliFill Content Script
 * Version: 2.0
 */
let permissionPopupActive = false;

(async () => {

    console.log("🚀 IntelliFill Started");

    const loaded = await initializeProfile();

    if (!loaded) {

        console.warn("❌ Profile not found");

        return;

    }

    console.log("✅ Profile Loaded");

    // Initial Scan
    await processCurrentPage();

    // Observe Dynamic Forms
    observeFormChanges(async () => {

        console.log("🔄 Dynamic Form Changed");

        await processCurrentPage();

    });

})();

/**
 * Scan Current Page
 */

async function processCurrentPage(isManual = false) {
    const fields =
        detectFormFields();

    const aiSettings =
        await loadAISettings();

    console.log(
        "AI SETTINGS",
        aiSettings
    );

    if (!fields.length) {

        console.log(
            "❌ No Form Found"
        );

        if (isManual) {

            showNoFormPopup();

        }

        return;

    }
    const classifiedFields = [];

    // ============================
    // Classify Fields
    // ============================

    for (const field of fields) {

        const classification =
            await classifyField(

                field,

                aiSettings

            );
        classifiedFields.push({

            ...field,

            classification

        });

    }

    // ============================
    // Debug Table
    // ============================

    console.table(

        classifiedFields.map(field => ({

            Label: field.label,

            Name: field.name,

            Placeholder: field.placeholder,

            HTMLType: field.type,

            Classification:
                field.classification.fieldType,

            Source:
                field.classification.source,

            Value:
                getProfileValue(
                    field.classification.fieldType
                )

        }))

    );

    // ============================
    // Check Real Form
    // ============================

    const detectedFields = classifiedFields.filter(field => {

        return field.classification.fieldType !== "UNKNOWN";

    });

    console.log(
        `🎯 Valid Fields Detected: ${detectedFields.length}`
    );

    // Ignore pages having less than 2 useful fields
    if (detectedFields.length < 2) {

        console.log("❌ No Supported Form");

        return false;

    }

    // ============================
    // Ask User Permission
    // ============================

    // Another scan is already waiting for user response
    if (permissionPopupActive) {

        console.log("⏳ Permission popup already active");

        return;

    }

    permissionPopupActive = true;

    console.log("🔔 Showing autofill permission popup");

    const shouldAutofill =
        await showAutofillPermission();

    permissionPopupActive = false;

    if (!shouldAutofill) {

        console.log("❌ User cancelled autofill");

        return;

    }

    console.log("✅ User approved autofill");

    // ============================
    // Autofill
    // ============================

    for (const field of classifiedFields) {

        const fieldType =
            field.classification.fieldType;

        if (fieldType === "UNKNOWN") {

            continue;

        }

        const value =
            getProfileValue(fieldType);

        if (

            value === null ||

            value === undefined ||

            value === ""

        ) {

            continue;

        }

        autofillField(

            field.element,

            value

        );

        console.log(

            `✅ Filled ${fieldType}`,

            value

        );

    }

    console.log(

        `🎉 IntelliFill Completed (${classifiedFields.length} fields)`

    );
    return true;
}
// ==========================================
// Listen From Popup
// ==========================================

chrome.runtime.onMessage.addListener(

    async (message, sender, sendResponse) => {

        if (message.action !== "START_AUTOFILL") {

            return;

        }

        const result =
            await processCurrentPage(true);

        sendResponse({

            found: result

        });

        return true;

    }

);
// ==========================================
// No Supported Form Popup
// ==========================================

function showNoFormPopup() {
    console.log("🔥 showNoFormPopup Called");
    const oldPopup =
        document.getElementById("ifNoFormPopup");

    if (oldPopup) {

        oldPopup.remove();

    }

    const popup =
        document.createElement("div");

    popup.id = "ifNoFormPopup";
    popup.style.position = "fixed";

    popup.style.top = "20px";

    popup.style.right = "20px";

    popup.style.zIndex = "999999";

    popup.innerHTML = `

        <div class="ifPopup">

            <div class="ifIcon">

                ❌

            </div>

            <h3>

                No Supported Form

            </h3>

            <p>

                This page doesn't contain a supported
                registration or application form.

            </p>

        </div>

    `;

    document.body.appendChild(popup);

    setTimeout(() => {

        if (document.body.contains(popup)) {

            popup.remove();

        }

    }, 3000);

}