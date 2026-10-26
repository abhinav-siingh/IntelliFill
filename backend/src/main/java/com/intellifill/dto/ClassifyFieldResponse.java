package com.intellifill.dto;

public class ClassifyFieldResponse {

    private String fieldType;
    private Double confidence;
    private String source; // "cache" (rule engine hit) or "gemini"

    public ClassifyFieldResponse(String fieldType, Double confidence, String source) {
        this.fieldType = fieldType;
        this.confidence = confidence;
        this.source = source;
    }

    public String getFieldType() { return fieldType; }
    public Double getConfidence() { return confidence; }
    public String getSource() { return source; }
}
