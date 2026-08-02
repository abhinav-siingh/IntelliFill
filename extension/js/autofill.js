/**
 * IntelliFill Autofill Engine
 * Version: 2.2
 */

function autofillField(element, value) {

    if (!element || value == null || value === "") {
        return;
    }

    // Don't overwrite existing values
    if (
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
function fillRadio(element, value) {

    const radioText = (
        element.value +
        " " +
        element.id +
        " " +
        element.name
    ).toLowerCase();

    const profileValue = value.toString().toLowerCase();

    if (radioText.includes(profileValue)) {

        element.checked = true;

        triggerEvents(element);

    }

}

/**
 * Fill Textarea
 */
function fillTextarea(element, value) {

    element.focus();

    element.value = value;

    triggerEvents(element);

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