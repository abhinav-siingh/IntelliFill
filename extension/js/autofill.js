/**
 * IntelliFill Autofill Engine
 * Version: 1.0
 */

function autofillField(element, value) {

    if (!element || value == null) {
        return;
    }

    element.focus();

    element.value = value;

    element.dispatchEvent(
        new Event("input", { bubbles: true })
    );

    element.dispatchEvent(
        new Event("change", { bubbles: true })
    );

    element.blur();

}