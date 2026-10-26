package com.intellifill.dto;

import com.intellifill.entity.Rule;
import jakarta.validation.constraints.NotBlank;

public class RuleDto {

    private Long id;

    @NotBlank(message = "fieldType is required")
    private String fieldType;

    @NotBlank(message = "label is required")
    private String label;

    private String alias;
    private Double confidence;
    private String source;

    public static RuleDto fromEntity(Rule r) {
        RuleDto dto = new RuleDto();
        dto.id = r.getId();
        dto.fieldType = r.getFieldType();
        dto.label = r.getLabel();
        dto.alias = r.getAlias();
        dto.confidence = r.getConfidence();
        dto.source = r.getSource();
        return dto;
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
}
