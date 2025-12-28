-- Add external_links column to grammar table
ALTER TABLE grammar ADD COLUMN IF NOT EXISTS external_links JSONB DEFAULT '[]';

-- Add external_links, context, and synonyms columns to expressions table
ALTER TABLE expressions ADD COLUMN IF NOT EXISTS external_links JSONB DEFAULT '[]';
ALTER TABLE expressions ADD COLUMN IF NOT EXISTS context JSONB DEFAULT '{}';
ALTER TABLE expressions ADD COLUMN IF NOT EXISTS synonyms JSONB DEFAULT '[]';
