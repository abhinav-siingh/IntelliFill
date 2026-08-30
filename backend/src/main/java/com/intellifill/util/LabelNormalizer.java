package com.intellifill.util;

/**
 * Normalizes a raw field label/name/placeholder into a stable, comparable
 * string, so "Full Name", "fullName", "full_name" and "FULL NAME" all
 * collapse to the same rule-cache key: "full name".
 */
public class LabelNormalizer {

    public static String normalize(String raw) {
        if (raw == null) return "";

        String result = raw.trim();
        result = result.replaceAll("([a-z])([A-Z])", "$1 $2"); // split camelCase BEFORE lowercasing
        result = result.toLowerCase();
        result = result.replaceAll("[_\\-]+", " ");             // snake_case / kebab-case -> spaces
        result = result.replaceAll("[^a-z0-9 ]", "");           // strip punctuation/symbols
        result = result.replaceAll("\\s+", " ");                // collapse repeated spaces
        return result.trim();
    }

}
