package com.intellifill.service;

import com.intellifill.dto.ClassifyFieldRequest;
import com.intellifill.dto.ClassifyFieldResponse;
import com.intellifill.entity.AiRequest;
import com.intellifill.entity.Rule;
import com.intellifill.repository.AiRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AIService {

    private final RuleService ruleService;
    private final GeminiService geminiService;
    private final AiRequestRepository aiRequestRepository;

    public AIService(
            RuleService ruleService,
            GeminiService geminiService,
            AiRequestRepository aiRequestRepository
    ) {
        this.ruleService = ruleService;
        this.geminiService = geminiService;
        this.aiRequestRepository = aiRequestRepository;
    }

    /**
     * The full pipeline (matches the earlier agreed workflow):
     *   1. Check the rule cache first - if it already knows this label, return
     *      instantly, NEVER call Gemini.
     *   2. Only on a cache miss, call Gemini.
     *   3. Save Gemini's result back into the rule cache (learning) so the
     *      exact same label is never sent to Gemini again.
     *   4. Log the attempt (metadata only - never the API key).
     */
    public ClassifyFieldResponse classifyField(Long userId, ClassifyFieldRequest request) {

        // Step 1: rule cache lookup
        Optional<Rule> cached = ruleService.findMatch(request.getLabel());
        if (cached.isPresent()) {
            Rule rule = cached.get();
            logRequest(userId, request, rule.getFieldType(), "cache", "CACHE_HIT");
            return new ClassifyFieldResponse(rule.getFieldType(), rule.getConfidence(), "cache");
        }

        // Step 2: Gemini fallback
        try {
            GeminiService.ClassificationResult result = geminiService.classify(request, request.getApiKey());

            // Step 3: learn it, so next time it's a cache hit
            if (!"UNKNOWN".equals(result.fieldType())) {
                ruleService.learnRule(request.getLabel(), result.fieldType(), result.confidence());
            }

            logRequest(userId, request, result.fieldType(), result.modelUsed(), "SUCCESS");
            return new ClassifyFieldResponse(result.fieldType(), result.confidence(), "gemini");

        } catch (Exception e) {
            logRequest(userId, request, "UNKNOWN", "unknown", "ERROR");
            throw e;
        }
    }

    public long getUsageCount(Long userId) {
        return aiRequestRepository.countByUserId(userId);
    }

    public List<AiRequest> getUsageHistory(Long userId) {
        return aiRequestRepository.findByUserId(userId);
    }

    private void logRequest(Long userId, ClassifyFieldRequest request, String fieldType, String model, String status) {
        // Deliberately does NOT log request.getApiKey() anywhere - security requirement.
        AiRequest log = new AiRequest();
        log.setUserId(userId);
        log.setFieldLabel(request.getLabel());
        log.setFieldName(request.getName());
        log.setFieldType(fieldType);
        log.setModel(model);
        log.setStatus(status);
        aiRequestRepository.save(log);
    }

}
