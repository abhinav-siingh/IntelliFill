package com.intellifill.controller;

import com.intellifill.dto.ApiResponse;
import com.intellifill.dto.RuleDto;
import com.intellifill.service.RuleService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rules")
public class RuleController {

    private final RuleService ruleService;

    public RuleController(RuleService ruleService) {
        this.ruleService = ruleService;
    }

    @GetMapping
    public ApiResponse<List<RuleDto>> getAll() {
        return ApiResponse.success(ruleService.getAllRules());
    }

    @PostMapping
    public ApiResponse<RuleDto> create(@Valid @RequestBody RuleDto dto) {
        return ApiResponse.success(ruleService.createRule(dto));
    }

    @PutMapping("/{id}")
    public ApiResponse<RuleDto> update(@PathVariable Long id, @RequestBody RuleDto dto) {
        return ApiResponse.success(ruleService.updateRule(id, dto));
    }

}
