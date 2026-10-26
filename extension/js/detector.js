/**
 * Detect all form fields on the current page
 */

/**
 * Smart Label Detection
 */

let scanTimeout = null;
function getLabel(element) {

    // 1. <label for="id">
    if (element.id) {

        const label = document.querySelector(`label[for="${element.id}"]`);

        if (label && label.innerText.trim()) {
            return label.innerText.trim();
        }

    }

    // 2. Parent <label>
    const parentLabel = element.closest("label");

    if (parentLabel && parentLabel.innerText.trim()) {
        return parentLabel.innerText.trim();
    }

    // 3. aria-label
    const ariaLabel = element.getAttribute("aria-label");

    if (ariaLabel && ariaLabel.trim()) {
        return ariaLabel.trim();
    }

    // 4. placeholder
    if (element.placeholder && element.placeholder.trim()) {
        return element.placeholder.trim();
    }

    // 5. name
    if (element.name && element.name.trim()) {
        return element.name.trim();
    }

    // 6. id
    if (element.id && element.id.trim()) {
        return element.id.trim();
    }

    return "";

}
/**
 * Check if a field should be ignored
 */
function shouldIgnoreField(element) {

    const ignoreTypes = [
        "hidden",
        "submit",
        "button",
        "reset",
        "image"
    ];

    if (ignoreTypes.includes(element.type)) {
        return true;
    }

    if (element.disabled) {
        return true;
    }

    // Ignore search inputs
    if (element.type === "search") {
        return true;
    }

    // Ignore common filter/search ids
    const text =
        (
            element.id +
            " " +
            element.name +
            " " +
            element.placeholder
        ).toLowerCase();

    const ignoreKeywords = [
        "search",
        "filter",
        "toggle"
    ];

    return ignoreKeywords.some(keyword => text.includes(keyword));
}

function detectFormFields() {

    const elements = document.querySelectorAll("input, textarea, select");

    const fields = [];

    elements.forEach(element => {

        if (shouldIgnoreField(element)) {
            return;
        }

        fields.push({

            element: element,

            tag: element.tagName.toLowerCase(),

            type: element.type || "",

            id: element.id || "",

            name: element.name || "",

            label: getLabel(element),

            placeholder: element.placeholder || "",

            inputMode: element.inputMode || "",

            pattern: element.pattern || "",

            required: element.required || false,

            disabled: element.disabled || false,

            readOnly: element.readOnly || false,

            visible: element.offsetParent !== null

        });

    });

    console.log("========== IntelliFill Detector ==========");

    console.table(fields);

    return fields;

}
/**
 * Observe dynamically added form fields
 */
/**
 * Observe dynamically added form fields
 */

function observeFormChanges(callback) {

    console.log("✅ Observer Started");

    const observer = new MutationObserver((mutations) => {

        let shouldScan = false;

        mutations.forEach((mutation) => {

            mutation.addedNodes.forEach((node) => {

                if (!(node instanceof HTMLElement)) {
                    return;
                }

                if (
                    node.matches?.("input, textarea, select") ||
                    node.querySelector?.("input, textarea, select")
                ) {
                    shouldScan = true;
                }

            });

        });

        if (!shouldScan) {
            return;
        }

        clearTimeout(scanTimeout);

        scanTimeout = setTimeout(() => {

            console.log("🔄 New Form Detected");

            if (typeof callback === "function") {
                callback();
            }

        }, 300);

    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

}