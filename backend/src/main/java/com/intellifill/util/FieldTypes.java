package com.intellifill.util;

import java.util.Set;

/**
 * The fixed set of standard field types. Both the rule engine (rules table)
 * and Gemini classification results are always constrained to one of these -
 * this whitelist is also the main defense against prompt injection: even if
 * a malicious webpage crafts a field label to try to manipulate the Gemini
 * prompt, the response is checked against this list before ever being
 * trusted or saved. Anything else becomes UNKNOWN.
 */
public class FieldTypes {

    public static final Set<String> ALL = Set.of(
            "FULL_NAME", "FIRST_NAME", "LAST_NAME", "EMAIL", "PHONE", "DOB", "GENDER",
            "FATHER_NAME", "MOTHER_NAME", "ADDRESS", "CITY", "STATE", "COUNTRY", "PINCODE",
            "COLLEGE", "UNIVERSITY", "SCHOOL", "COURSE", "DEGREE", "SKILLS",
            "LINKEDIN", "GITHUB", "PORTFOLIO", "RESUME", "EXPERIENCE",
            "CURRENT_STATUS", "PREFERRED_ROLE", "PREFERRED_LOCATION",
            "CATEGORY", "RELIGION", "PWD", "NATIONALITY", "CITIZENSHIP", "MARITAL_STATUS",
            "BOARD", "PASSING_YEAR", "PERCENTAGE", "GRADE", "STREAM",
            "UNKNOWN"
    );

    public static boolean isValid(String fieldType) {
        return fieldType != null && ALL.contains(fieldType.toUpperCase().trim());
    }

}
