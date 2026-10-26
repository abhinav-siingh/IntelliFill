// 📄 Resume Upload Architecture
// Option 1 — Store Resume in Chrome Storage ❌
// Easy to implement
// Lekin Chrome Storage ki size limit hai
// PDF ko Base64 me convert karna padega
// Large files ke liye suitable nahi
// Option 2 — Store Resume in IndexedDB ✅ (Recommended)
// Browser ka local database
// Large PDFs handle kar sakta hai
// Fast
// Chrome Extension ke liye industry-standard approach
// Future me AI Resume Parsing ke liye bhi perfect





// ======================================
// IntelliFill Database Manager
// IndexedDB
// ======================================

const DB_NAME = "IntelliFillDB";
const DB_VERSION = 1;

const PROFILE_STORE = "profiles";
const RESUME_STORE = "resumes";

let db = null;

function openDatabase() {

    return new Promise((resolve, reject) => {

        if (db) {
            resolve(db);
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {

            reject("Unable to open database.");

        };

        request.onsuccess = (event) => {

            db = event.target.result;

            resolve(db);

        };

        request.onupgradeneeded = (event) => {

            db = event.target.result;

            if (!db.objectStoreNames.contains(PROFILE_STORE)) {

                db.createObjectStore(PROFILE_STORE, {
                    keyPath: "id"
                });

            }

            if (!db.objectStoreNames.contains(RESUME_STORE)) {

                db.createObjectStore(RESUME_STORE, {
                    keyPath: "id"
                });

            }

        };

    });

}

// ======================================
// Save Resume
// ======================================

async function saveResume(resume) {

    const database = await openDatabase();

    return new Promise((resolve, reject) => {

        const transaction = database.transaction(RESUME_STORE, "readwrite");

        const store = transaction.objectStore(RESUME_STORE);

        const request = store.put(resume);

        request.onsuccess = () => resolve(true);

        request.onerror = () => reject(request.error);

    });

}

// ======================================
// Load Resume
// ======================================

async function loadResume() {

    const database = await openDatabase();

    return new Promise((resolve, reject) => {

        const transaction = database.transaction(RESUME_STORE, "readonly");

        const store = transaction.objectStore(RESUME_STORE);

        const request = store.get("resume");

        request.onsuccess = () => resolve(request.result);

        request.onerror = () => reject(request.error);

    });

}

// ======================================
// Delete Resume
// ======================================

async function deleteResume() {

    const database = await openDatabase();

    return new Promise((resolve, reject) => {

        const transaction = database.transaction(RESUME_STORE, "readwrite");

        const store = transaction.objectStore(RESUME_STORE);

        const request = store.delete("resume");

        request.onsuccess = () => resolve(true);

        request.onerror = () => reject(request.error);

    });

}