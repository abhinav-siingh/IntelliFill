/**
 * IntelliFill Autofill Engine
 * Version: 2.2
 */

function autofillField(element, value) {

    if (!element || value == null || value === "") {
        return;
    }

    // Don't overwrite existing values
    // Don't overwrite existing values
    // Skip this check for radio & checkbox
    if (
        element.tagName.toLowerCase() !== "select" &&
        element.type !== "radio" &&
        element.type !== "checkbox" &&
        element.value &&
        element.value.toString().trim() !== ""
    ) {
        return;
    }

    const tag = element.tagName.toLowerCase();

    switch (tag) {

        case "input":

            if (element.type === "radio") {

                fillRadio(element, value);

            } else if (element.type === "checkbox") {

                fillCheckbox(element, value);

            } else {

                fillInput(element, value);

            }

            break;

        case "textarea":
            fillTextarea(element, value);
            break;

        case "select":
            fillSelect(element, value);
            break;

        default:
            return;

    }

}

/**
 * Fill Input
 */
function fillInput(element, value) {

    element.focus();

    element.value = value;

    triggerEvents(element);

}

/**
 * Fill Radio Button
 */
/**
 * Fill Radio Button
 */
function fillRadio(element, value) {

    const profileValue =
        value.toString().trim().toLowerCase();

    let labelText = "";

    // Label linked using "for"
    if (element.id) {

        const label = document.querySelector(
            `label[for="${element.id}"]`
        );

        if (label) {
            labelText = label.innerText;
        }

    }

    // Parent label
    if (!labelText) {

        const parentLabel = element.closest("label");

        if (parentLabel) {
            labelText = parentLabel.innerText;
        }

    }

    const searchableText = (
        (element.value || "") +
        " " +
        (element.name || "") +
        " " +
        (labelText || "")
    )
        .toLowerCase()
        .trim();

    const matched = searchableText
        .split(/\s+/)
        .some(word => word === profileValue);

    if (matched) {

        element.checked = true;

        triggerEvents(element);

    }

}

/**
 * Fill Checkbox
 */
function fillCheckbox(element, value) {

    if (value === true) {

        element.checked = true;

        triggerEvents(element);

    }

}

/**
 * Match Dropdown Option
 */
function findMatchingOption(options, value) {

    const profileValue =
        value.toString().trim().toLowerCase();

    // 1. Exact Match
    let matched = options.find(option => {

        const text = option.text.trim().toLowerCase();
        const val = option.value.trim().toLowerCase();

        return text === profileValue || val === profileValue;

    });

    if (matched) {
        return matched;
    }

    // 2. Alias Match
    for (const [key, aliases] of Object.entries(VALUE_ALIASES)) {

        const allValues = [
            key.toLowerCase(),
            ...aliases.map(a => a.toLowerCase())
        ];

        if (!allValues.includes(profileValue)) {
            continue;
        }

        matched = options.find(option => {

            const text = option.text.trim().toLowerCase();
            const val = option.value.trim().toLowerCase();

            return allValues.includes(text) ||
                allValues.includes(val);

        });

        if (matched) {
            return matched;
        }

    }

    // 3. Contains Match
    matched = options.find(option => {

        const text = option.text.trim().toLowerCase();

        return text.includes(profileValue) ||
            profileValue.includes(text);

    });

    if (matched) {
        return matched;
    }

    // 4. StartsWith Match
    matched = options.find(option => {

        const text = option.text.trim().toLowerCase();

        return text.startsWith(profileValue) ||
            profileValue.startsWith(text);

    });

    return matched || null;

}

/**
 * Fill Select Dropdown
 */
function fillSelect(element, value) {

    const options = [...element.options];

    const matchedOption = findMatchingOption(
        options,
        value
    );

    if (!matchedOption) {
        console.log(
            "❌ No matching dropdown option:",
            value
        );
        return;
    }

    element.value = matchedOption.value;

    triggerEvents(element);

    console.log(
        "✅ Dropdown Selected:",
        matchedOption.text
    );
}

/**
 * Trigger DOM Events
 */
function triggerEvents(element) {

    element.dispatchEvent(
        new Event("input", {
            bubbles: true
        })
    );

    element.dispatchEvent(
        new Event("change", {
            bubbles: true
        })
    );

    element.dispatchEvent(
        new Event("blur", {
            bubbles: true
        })
    );

}