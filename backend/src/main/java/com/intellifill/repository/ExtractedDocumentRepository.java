package com.intellifill.repository;

import com.intellifill.entity.ExtractedDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ExtractedDocumentRepository extends JpaRepository<ExtractedDocument, Long> {
    Optional<ExtractedDocument> findByUserIdAndDocumentId(Long userId, String documentId);
}
