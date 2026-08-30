package com.intellifill.controller;

import com.intellifill.dto.ApiResponse;
import com.intellifill.dto.SettingsDto;
import com.intellifill.service.SettingsService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final SettingsService settingsService;

    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping
    public ApiResponse<SettingsDto> get(@AuthenticationPrincipal Long userId) {
        return ApiResponse.success(settingsService.getSettings(userId));
    }

    @PutMapping
    public ApiResponse<SettingsDto> update(@AuthenticationPrincipal Long userId, @RequestBody SettingsDto dto) {
        return ApiResponse.success(settingsService.updateSettings(userId, dto));
    }

}
