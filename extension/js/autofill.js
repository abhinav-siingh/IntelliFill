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
 * Fill Select Dropdown
 */
function fillSelect(element, value) {

    const options = [...element.options];

    const normalizedValue =
        value.toString().trim().toLowerCase();

    const matchedOption = options.find(option => {

        const optionText =
            option.text.trim().toLowerCase();

        const optionValue =
            option.value.trim().toLowerCase();

        return (

            optionText === normalizedValue ||

            optionValue === normalizedValue ||

            optionText.includes(normalizedValue) ||

            normalizedValue.includes(optionText)

        );

    });

    if (!matchedOption) {
        return;
    }

    element.value = matchedOption.value;

    triggerEvents(element);

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