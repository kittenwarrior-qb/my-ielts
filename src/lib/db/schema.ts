import { pgTable, text, timestamp, integer, jsonb, varchar, pgEnum, real } from 'drizzle-orm/pg-core';

// Enums
export const levelEnum = pgEnum('level', ['beginner', 'intermediate', 'advanced']);
export const wordTypeEnum = pgEnum('word_type', ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'interjection', 'pronoun']);
export const skillEnum = pgEnum('skill', ['listening', 'reading', 'speaking', 'writing']);
export const categoryEnum = pgEnum('category', ['speaking', 'writing', 'general']);
export const expressionTypeEnum = pgEnum('expression_type', ['idiom', 'phrase']);

// Topics Table
export const topics = pgTable('topics', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Vocabulary Table
export const vocabulary = pgTable('vocabulary', {
  id: text('id').primaryKey(),
  word: text('word').notNull().unique(),
  phonetic: text('phonetic').notNull(),
  audioUrl: text('audio_url'),
  userAudioUrl: text('user_audio_url'),
  types: jsonb('types').notNull(), // Array of {type, meanings[]}
  examples: jsonb('examples').notNull(), // Array of strings
  synonyms: jsonb('synonyms').notNull(), // Array of strings
  wordForms: jsonb('word_forms').notNull(), // Array of strings
  topics: jsonb('topics').notNull(), // Array of strings
  level: levelEnum('level').notNull(),
  band: real('band').notNull(), // IELTS band score (can be 6.5, 7.5, etc.)
  grammar: text('grammar'), // Grammar notes in English
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Expressions Table (combining Idioms and Phrases)
export const expressions = pgTable('expressions', {
  id: text('id').primaryKey(),
  expression: text('expression').notNull().unique(),
  type: expressionTypeEnum('type').notNull(), // 'idiom' or 'phrase'
  meaning: text('meaning').notNull(),
  examples: jsonb('examples').notNull(), // Array of strings
  grammar: text('grammar'), // Grammar notes in English
  relatedWords: jsonb('related_words').notNull(), // Array of strings
  topics: jsonb('topics').notNull(), // Array of strings
  category: text('category'), // For phrases: speaking, writing, general
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Grammar Table
export const grammar = pgTable('grammar', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  structure: text('structure').notNull(), // Grammar structure/pattern
  explanation: text('explanation').notNull(),
  examples: jsonb('examples').notNull(), // Array of strings
  usage: text('usage'), // When to use this grammar
  notes: text('notes'), // Additional notes
  topics: jsonb('topics').notNull(), // Array of strings
  level: levelEnum('level').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Keep old tables for backward compatibility (deprecated)
// Idioms Table
export const idioms = pgTable('idioms', {
  id: text('id').primaryKey(),
  idiom: text('idiom').notNull().unique(),
  meaning: text('meaning').notNull(),
  examples: jsonb('examples').notNull(), // Array of strings
  relatedWords: jsonb('related_words').notNull(), // Array of strings
  topics: jsonb('topics').notNull(), // Array of strings
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Phrases Table
export const phrases = pgTable('phrases', {
  id: text('id').primaryKey(),
  phrase: text('phrase').notNull().unique(),
  meaning: text('meaning').notNull(),
  examples: jsonb('examples').notNull(), // Array of strings
  category: categoryEnum('category').notNull(),
  topics: jsonb('topics').notNull(), // Array of strings
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Skill Content Table
export const skillContent = pgTable('skill_content', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  skill: skillEnum('skill').notNull(),
  content: text('content').notNull(),
  relatedVocabulary: jsonb('related_vocabulary').notNull(), // Array of strings
  audioUrl: text('audio_url'),
  userAudioUrl: text('user_audio_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Types for TypeScript
export type Topic = typeof topics.$inferSelect;
export type NewTopic = typeof topics.$inferInsert;

export type Vocabulary = typeof vocabulary.$inferSelect;
export type NewVocabulary = typeof vocabulary.$inferInsert;

export type Grammar = typeof grammar.$inferSelect;
export type NewGrammar = typeof grammar.$inferInsert;

export type Expression = typeof expressions.$inferSelect;
export type NewExpression = typeof expressions.$inferInsert;

// Deprecated - use Expression instead
export type Idiom = typeof idioms.$inferSelect;
export type NewIdiom = typeof idioms.$inferInsert;

export type Phrase = typeof phrases.$inferSelect;
export type NewPhrase = typeof phrases.$inferInsert;

export type SkillContent = typeof skillContent.$inferSelect;
export type NewSkillContent = typeof skillContent.$inferInsert;
