package com.intellifill.dto;

import java.util.Map;

public class ExtractedDocumentDto {
    private String documentId;
    private String sourceName;
    private Map<String, String> fields;
    public String getDocumentId() { return documentId; }
    public void setDocumentId(String documentId) { this.documentId = documentId; }
    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }
    public Map<String, String> getFields() { return fields; }
    public void setFields(Map<String, String> fields) { this.fields = fields; }
}
