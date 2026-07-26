// storage.js

const STORAGE_KEY = "intellifill_profile";

async function saveProfile(profileData) {
    return new Promise((resolve) => {

        chrome.storage.local.set(
            {
                [STORAGE_KEY]: profileData
            },
            () => {
                console.log("Profile Saved");
                resolve();
            }
        );

    });
}

async function loadProfile() {

    return new Promise((resolve) => {

        chrome.storage.local.get(
            STORAGE_KEY,
            (result) => {

                resolve(result[STORAGE_KEY] || null);

            }
        );

    });

}