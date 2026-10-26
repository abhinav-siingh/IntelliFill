/**
 * ==========================================
 * IntelliFill Floating Permission Popup
 * ==========================================
 */

async function showAutofillPermission() {

    console.log("🤖 IntelliFill Permission Popup");

    return new Promise((resolve) => {

        // Remove previous popup
        const existing =
            document.getElementById("ifPermissionOverlay");

        if (existing) {

            existing.remove();

        }

        // =====================================
        // Create Popup
        // =====================================

        const popup =
            document.createElement("div");

        popup.id = "ifPermissionOverlay";

        popup.innerHTML = `

            <div class="ifPopup">

                <button
                    id="ifClose"
                    class="ifCloseBtn">

                    ✕

                </button>

                <div class="ifIcon">

                    🤖

                </div>

                <h3>

                    Form Detected

                </h3>

                <p>

                    <b>IntelliFill</b> found a supported form.

                    <br>

                    Autofill using your saved profile?

                </p>

                <div class="ifButtons">

                    <button
                        id="ifNo">

                        Skip

                    </button>

                    <button
                        id="ifYes">

                        Autofill

                    </button>

                </div>

            </div>

        `;

        document.body.appendChild(popup);

        // =====================================
        // YES
        // =====================================

        document
            .getElementById("ifYes")
            .addEventListener("click", () => {

                popup.remove();

                resolve(true);

            });

        // =====================================
        // NO
        // =====================================

        document
            .getElementById("ifNo")
            .addEventListener("click", () => {

                popup.remove();

                resolve(false);

            });

        // =====================================
        // CLOSE
        // =====================================

        document
            .getElementById("ifClose")
            .addEventListener("click", () => {

                popup.remove();

                resolve(false);

            });

        // =====================================
        // ESC Key Support
        // =====================================

        const escHandler = (event) => {

            if (event.key === "Escape") {

                popup.remove();

                document.removeEventListener(
                    "keydown",
                    escHandler
                );

                resolve(false);

            }

        };

        document.addEventListener(
            "keydown",
            escHandler
        );

    });

}