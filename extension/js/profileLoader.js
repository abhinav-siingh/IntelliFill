/**
 * IntelliFill Profile Loader
 */

let USER_PROFILE = null;

async function initializeProfile() {

    console.log("➡ initializeProfile() called");

    USER_PROFILE = await loadProfile();

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