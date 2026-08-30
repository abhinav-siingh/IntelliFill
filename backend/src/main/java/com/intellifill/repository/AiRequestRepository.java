package com.intellifill.repository;

import com.intellifill.entity.AiRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AiRequestRepository extends JpaRepository<AiRequest, Long> {
    List<AiRequest> findByUserId(Long userId);
    long countByUserId(Long userId);
}
