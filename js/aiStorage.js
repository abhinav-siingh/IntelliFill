/**
 * IntelliFill AI Storage
 * Version: 1.0
 */

const AI_STORAGE_KEY = "aiSettings";

async function saveAISettings(settings) {

    return new Promise(resolve => {

        chrome.storage.local.set({

            [AI_STORAGE_KEY]: settings

        }, resolve);

    });

}

async function loadAISettings() {

    return new Promise(resolve => {

        chrome.storage.local.get(

            AI_STORAGE_KEY,

            result => {

                resolve(

                    result[AI_STORAGE_KEY] || {

                        apiKey: "",

                        connected: false,

                        model: ""

                    }

                );

            }

        );

    });

}