CREATE TABLE IF NOT EXISTS extracted_documents (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  document_id VARCHAR(80) NOT NULL,
  source_name VARCHAR(255) NOT NULL,
  structured_data LONGTEXT NOT NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_extracted_documents_user_document (user_id, document_id),
  KEY idx_extracted_documents_user (user_id)
);
