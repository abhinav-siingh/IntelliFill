package com.intellifill.controller;

import com.intellifill.dto.ApiResponse;
import com.intellifill.dto.ClassifyFieldRequest;
import com.intellifill.dto.ClassifyFieldResponse;
import com.intellifill.dto.UsageDto;
import com.intellifill.service.AIService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/classify-field")
    public ApiResponse<ClassifyFieldResponse> classifyField(
            @AuthenticationPrincipal Long userId,
            @Valid @RequestBody ClassifyFieldRequest request
    ) {
        return ApiResponse.success(aiService.classifyField(userId, request));
    }

    @GetMapping("/usage")
    public ApiResponse<UsageDto> usage(@AuthenticationPrincipal Long userId) {
        return ApiResponse.success(new UsageDto(aiService.getUsageCount(userId)));
    }

}
