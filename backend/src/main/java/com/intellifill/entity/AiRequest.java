package com.intellifill.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Maps to the "ai_requests" table. Logs metadata about each classification
 * call for usage tracking (GET /api/ai/usage) - deliberately NEVER stores
 * the Gemini API key, per the security requirement "never log API keys".
 */
@Entity
@Table(name = "ai_requests")
public class AiRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "field_label")
    private String fieldLabel;

    @Column(name = "field_name")
    private String fieldName;

    @Column(name = "field_type")
    private String fieldType; // the result, e.g. FATHER_NAME or UNKNOWN

    private String model;

    // "SUCCESS", "CACHE_HIT" (no Gemini call needed), or "ERROR"
    private String status;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFieldLabel() { return fieldLabel; }
    public void setFieldLabel(String fieldLabel) { this.fieldLabel = fieldLabel; }

    public String getFieldName() { return fieldName; }
    public void setFieldName(String fieldName) { this.fieldName = fieldName; }

    public String getFieldType() { return fieldType; }
    public void setFieldType(String fieldType) { this.fieldType = fieldType; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
