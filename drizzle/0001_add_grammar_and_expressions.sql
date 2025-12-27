-- Add grammar column to vocabulary table
ALTER TABLE vocabulary ADD COLUMN grammar TEXT;

-- Create expressions table (combining idioms and phrases)
CREATE TYPE expression_type AS ENUM ('idiom', 'phrase');

CREATE TABLE expressions (
  id TEXT PRIMARY KEY,
  expression TEXT NOT NULL UNIQUE,
  type expression_type NOT NULL,
  meaning TEXT NOT NULL,
  examples JSONB NOT NULL,
  grammar TEXT,
  related_words JSONB NOT NULL,
  topics JSONB NOT NULL,
  category TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create grammar table
CREATE TABLE grammar (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  structure TEXT NOT NULL,
  explanation TEXT NOT NULL,
  examples JSONB NOT NULL,
  usage TEXT,
  notes TEXT,
  topics JSONB NOT NULL,
  level level NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Migrate data from idioms to expressions
INSERT INTO expressions (id, expression, type, meaning, examples, grammar, related_words, topics, category, created_at, updated_at)
SELECT id, idiom, 'idiom'::expression_type, meaning, examples, NULL, related_words, topics, NULL, created_at, updated_at
FROM idioms;

-- Migrate data from phrases to expressions
INSERT INTO expressions (id, expression, type, meaning, examples, grammar, related_words, topics, category, created_at, updated_at)
SELECT id, phrase, 'phrase'::expression_type, meaning, examples, NULL, '[]'::jsonb, topics, category::text, created_at, updated_at
FROM phrases;
