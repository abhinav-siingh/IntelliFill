/**
 * IntelliFill Backend Client
 * Version: 1.0
 *
 * All communication with the Spring Boot backend goes through this file.
 * Change BACKEND_URL when you deploy the backend somewhere other than
 * your local machine.
 */

const BACKEND_URL = "http://localhost:8080";

async function backendRegister(name, email, password) {
    const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Registration failed");
    return data.data; // { token, user }
}

async function backendLogin(email, password) {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Login failed");
    return data.data; // { token, user }
}

/**
 * Calls the backend's cache-first, Gemini-fallback classifier.
 * Returns the same shape classifier.js already expects from Gemini directly:
 * { success: boolean, fieldType: string }
 *
 * @param field   the field metadata detector.js extracted
 * @param apiKey  the user's own Gemini key (aiSettings.apiKey) - sent so the
 *                backend uses it instead of the shared server key, keeping
 *                the existing "your key stays yours" behavior intact
 * @param token   backend JWT, from authStorage.js
 */
async function classifyFieldViaBackend(field, apiKey, token) {
    try {
        const res = await fetch(`${BACKEND_URL}/api/ai/classify-field`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                label: field.label || "",
                name: field.name || "",
                placeholder: field.placeholder || "",
                type: field.type || "",
                id: field.id || "",
                apiKey: apiKey || undefined
            })
        });

        const data = await res.json();

        if (!data.success) {
            console.warn("Backend classify-field failed:", data.message);
            return { success: false, fieldType: "UNKNOWN" };
        }

        return { success: true, fieldType: data.data.fieldType };

    } catch (error) {
        console.error("Backend Network Error:", error);
        return { success: false, fieldType: "UNKNOWN" };
    }
}
