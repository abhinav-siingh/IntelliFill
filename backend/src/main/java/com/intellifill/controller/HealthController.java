package com.intellifill.controller;

import com.intellifill.dto.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Phase 1: only endpoint that exists. Confirms the app is running
 * and (once we hit it) that it started successfully against MySQL.
 */
@RestController
public class HealthController {

    @GetMapping("/api/health")
    public ApiResponse<Map<String, String>> health() {
        return ApiResponse.success(Map.of("status", "UP"));
    }

}
