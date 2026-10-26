package com.intellifill.repository;

import com.intellifill.entity.Rule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RuleRepository extends JpaRepository<Rule, Long> {

    // Used by the classification endpoint (Phase 7) to check the cache
    // before ever calling Gemini.
    Optional<Rule> findByLabel(String label);

}
