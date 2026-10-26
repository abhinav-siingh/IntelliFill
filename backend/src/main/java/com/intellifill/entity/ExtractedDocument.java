package com.intellifill.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "extracted_documents", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "document_id"}))
public class ExtractedDocument {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "user_id", nullable = false) private Long userId;
    @Column(name = "document_id", nullable = false, length = 80) private String documentId;
    @Column(name = "source_name", nullable = false, length = 255) private String sourceName;
    @Lob @Column(name = "structured_data", nullable = false, columnDefinition = "LONGTEXT") private String structuredData;
    @Column(name = "created_at", nullable = false) private LocalDateTime createdAt;
    @PrePersist void onCreate() { createdAt = LocalDateTime.now(); }
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getDocumentId() { return documentId; }
    public void setDocumentId(String documentId) { this.documentId = documentId; }
    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }
    public String getStructuredData() { return structuredData; }
    public void setStructuredData(String structuredData) { this.structuredData = structuredData; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
