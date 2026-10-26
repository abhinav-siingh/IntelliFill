package com.intellifill.dto;

import jakarta.validation.constraints.NotBlank;

public class ClassifyFieldRequest {

    @NotBlank(message = "label is required")
    private String label;

    private String name;
    private String placeholder;
    private String type;
    private String id;

    // Optional: if the user has their own Gemini key configured in the
    // extension, it's sent here and used for just this one call - never
    // stored on the backend. If omitted, the server's shared key is used.
    private String apiKey;

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPlaceholder() { return placeholder; }
    public void setPlaceholder(String placeholder) { this.placeholder = placeholder; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getApiKey() { return apiKey; }
    public void setApiKey(String apiKey) { this.apiKey = apiKey; }
}
