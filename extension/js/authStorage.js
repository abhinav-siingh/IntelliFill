/**
 * IntelliFill Auth Storage
 * Version: 1.0
 *
 * Stores the backend JWT token (from POST /api/auth/login or /register)
 * so classifier.js and future backend calls can use it. This is separate
 * from aiSettings (the user's own Gemini key) - logging into the backend
 * and connecting a personal Gemini key are two independent things.
 */

const AUTH_STORAGE_KEY = "intellifill_auth";

async function saveAuthSession(token, email) {
    return new Promise(resolve => {
        chrome.storage.local.set(
            { [AUTH_STORAGE_KEY]: { token, email } },
            resolve
        );
    });
}

async function loadAuthSession() {
    return new Promise(resolve => {
        chrome.storage.local.get(AUTH_STORAGE_KEY, result => {
            resolve(result[AUTH_STORAGE_KEY] || null);
        });
    });
}

async function clearAuthSession() {
    return new Promise(resolve => {
        chrome.storage.local.remove(AUTH_STORAGE_KEY, resolve);
    });
}
