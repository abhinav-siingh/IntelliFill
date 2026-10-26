package com.intellifill.dto;

import com.intellifill.entity.Settings;

public class SettingsDto {

    private Boolean aiEnabled;
    private String preferredModel;

    public static SettingsDto fromEntity(Settings s) {
        SettingsDto dto = new SettingsDto();
        dto.aiEnabled = s.getAiEnabled();
        dto.preferredModel = s.getPreferredModel();
        return dto;
    }

    public Boolean getAiEnabled() { return aiEnabled; }
    public void setAiEnabled(Boolean aiEnabled) { this.aiEnabled = aiEnabled; }

    public String getPreferredModel() { return preferredModel; }
    public void setPreferredModel(String preferredModel) { this.preferredModel = preferredModel; }
}
