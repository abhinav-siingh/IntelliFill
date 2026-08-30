package com.intellifill.repository;

import com.intellifill.entity.Education;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EducationRepository extends JpaRepository<Education, Long> {
    Optional<Education> findByUserId(Long userId);
}
