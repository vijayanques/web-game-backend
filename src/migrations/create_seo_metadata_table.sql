-- Create SEO Metadata Table
-- Stores SEO metadata for games and categories

CREATE TABLE IF NOT EXISTS seo_metadata (
  id INT PRIMARY KEY AUTO_INCREMENT,
  entityType ENUM('game', 'category') NOT NULL,
  entityId INT NOT NULL,
  
  -- Basic SEO
  metaTitle VARCHAR(60),
  metaDescription VARCHAR(160),
  metaKeywords VARCHAR(255),
  canonicalUrl VARCHAR(500),
  
  -- Open Graph (Facebook/LinkedIn)
  ogTitle VARCHAR(100),
  ogDescription VARCHAR(160),
  ogImage VARCHAR(500),
  
  -- Twitter Card
  twitterTitle VARCHAR(100),
  twitterDescription VARCHAR(160),
  twitterImage VARCHAR(500),
  
  -- Advanced
  robots VARCHAR(100) DEFAULT 'index, follow',
  structuredData JSON,
  
  -- Timestamps
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Constraints
  UNIQUE KEY unique_entity (entityType, entityId),
  INDEX idx_entity_type (entityType)
);
