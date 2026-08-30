package com.intellifill.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Maps to the "rules" table. This is the persistent, GLOBAL learning cache -
 * shared across every user and every website. Unlike the extension's current
 * session-only in-memory cache (which resets on every page reload), this
 * survives forever.
 *
 * Example row:
 *   label = "guardian's full name"  (normalized, lowercase)
 *   fieldType = "FATHER_NAME"
 *   source = "AI"  (learned from Gemini once, reused forever after)
 */
@Entity
@Table(name = "rules")
public class Rule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // One of the STANDARD FIELD TYPES (FULL_NAME, FATHER_NAME, etc.)
    @Column(name = "field_type", nullable = false)
    private String fieldType;

    // The normalized label/name/placeholder text this rule matches against
    @Column(nullable = false, unique = true)
    private String label;

    // Optional comma-separated alternative phrasings that also map to the same fieldType
    private String alias;

    private Double confidence;

    // Where this rule came from: "RULE_ENGINE" (built-in), "AI" (learned from Gemini),
    // or "MANUAL" (a developer/admin added it directly via POST /api/rules)
    private String source;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFieldType() { return fieldType; }
    public void setFieldType(String fieldType) { this.fieldType = fieldType; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getAlias() { return alias; }
    public void setAlias(String alias) { this.alias = alias; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
