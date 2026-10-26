package com.intellifill.repository;

import com.intellifill.entity.SocialProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SocialProfileRepository extends JpaRepository<SocialProfile, Long> {
    Optional<SocialProfile> findByUserId(Long userId);
}
