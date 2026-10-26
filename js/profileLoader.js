/**
 * IntelliFill Profile Loader
 */

let USER_PROFILE = null;
let EXTRA_DOCUMENT_RECORDS = [];

async function initializeProfile() {

    console.log("➡ initializeProfile() called");

    USER_PROFILE = await loadProfile();
    const extra = await chrome.storage.local.get("intellifill_extracted_documents");
    EXTRA_DOCUMENT_RECORDS = extra.intellifill_extracted_documents || [];

    console.log("Storage Data:", USER_PROFILE);

    if (!USER_PROFILE) {
        console.warn("⚠ No IntelliFill profile found.");
        return false;
    }

    console.log("✅ Profile Loaded");

    return true;
}

function getProfile() {
    return USER_PROFILE;
}
