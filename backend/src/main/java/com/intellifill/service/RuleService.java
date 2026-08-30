package com.intellifill.service;

import com.intellifill.dto.RuleDto;
import com.intellifill.entity.Rule;
import com.intellifill.exception.ResourceNotFoundException;
import com.intellifill.repository.RuleRepository;
import com.intellifill.util.LabelNormalizer;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RuleService {

    private final RuleRepository ruleRepository;

    public RuleService(RuleRepository ruleRepository) {
        this.ruleRepository = ruleRepository;
    }

    public List<RuleDto> getAllRules() {
        return ruleRepository.findAll()
                .stream()
                .map(RuleDto::fromEntity)
                .collect(Collectors.toList());
    }

    public RuleDto createRule(RuleDto dto) {
        Rule rule = new Rule();
        rule.setFieldType(dto.getFieldType().toUpperCase().trim());
        rule.setLabel(LabelNormalizer.normalize(dto.getLabel()));
        rule.setAlias(dto.getAlias());
        rule.setConfidence(dto.getConfidence() != null ? dto.getConfidence() : 1.0);
        rule.setSource(dto.getSource() != null ? dto.getSource() : "MANUAL");

        return RuleDto.fromEntity(ruleRepository.save(rule));
    }

    public RuleDto updateRule(Long id, RuleDto dto) {
        Rule rule = ruleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rule not found"));

        if (dto.getFieldType() != null) rule.setFieldType(dto.getFieldType().toUpperCase().trim());
        if (dto.getLabel() != null) rule.setLabel(LabelNormalizer.normalize(dto.getLabel()));
        if (dto.getAlias() != null) rule.setAlias(dto.getAlias());
        if (dto.getConfidence() != null) rule.setConfidence(dto.getConfidence());
        if (dto.getSource() != null) rule.setSource(dto.getSource());

        return RuleDto.fromEntity(ruleRepository.save(rule));
    }

    /**
     * The core lookup used by the (Phase 7) AI classification endpoint:
     * given a raw field label, normalize it and check if a rule already
     * covers it - if so, no Gemini call is needed at all.
     */
    public Optional<Rule> findMatch(String rawLabel) {
        String normalized = LabelNormalizer.normalize(rawLabel);
        if (normalized.isEmpty()) return Optional.empty();
        return ruleRepository.findByLabel(normalized);
    }

    /**
     * Called after a successful Gemini classification (Phase 7) to permanently
     * learn the mapping, so the same label is never sent to Gemini again.
     */
    public void learnRule(String rawLabel, String fieldType, double confidence) {
        String normalized = LabelNormalizer.normalize(rawLabel);
        if (normalized.isEmpty()) return;

        // If it already exists (race condition / duplicate learning), don't fail - just skip.
        if (ruleRepository.findByLabel(normalized).isPresent()) return;

        Rule rule = new Rule();
        rule.setFieldType(fieldType);
        rule.setLabel(normalized);
        rule.setConfidence(confidence);
        rule.setSource("AI");
        ruleRepository.save(rule);
    }

}
