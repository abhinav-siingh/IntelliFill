package com.intellifill.service;

import com.intellifill.dto.SettingsDto;
import com.intellifill.entity.Settings;
import com.intellifill.repository.SettingsRepository;
import org.springframework.stereotype.Service;

@Service
public class SettingsService {

    private final SettingsRepository settingsRepository;

    public SettingsService(SettingsRepository settingsRepository) {
        this.settingsRepository = settingsRepository;
    }

    public SettingsDto getSettings(Long userId) {
        Settings settings = settingsRepository.findByUserId(userId).orElseGet(() -> {
            Settings s = new Settings();
            s.setUserId(userId);
            return settingsRepository.save(s); // save immediately so defaults (aiEnabled=true) persist
        });
        return SettingsDto.fromEntity(settings);
    }

    public SettingsDto updateSettings(Long userId, SettingsDto dto) {
        Settings settings = settingsRepository.findByUserId(userId).orElseGet(() -> {
            Settings s = new Settings();
            s.setUserId(userId);
            return s;
        });

        if (dto.getAiEnabled() != null) settings.setAiEnabled(dto.getAiEnabled());
        if (dto.getPreferredModel() != null) settings.setPreferredModel(dto.getPreferredModel());

        return SettingsDto.fromEntity(settingsRepository.save(settings));
    }

}
