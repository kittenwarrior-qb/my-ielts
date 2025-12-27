// Vocabulary Types
export interface WordType {
  type: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction' | 'interjection' | 'pronoun';
  meanings: string[];
}

export interface Vocabulary {
  id: string;
  word: string;
  phonetic: string;
  audioUrl?: string;
  userAudioUrl?: string;
  types: WordType[];
  examples: string[];
  synonyms: string[];
  wordForms: string[];
  topics: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  band: number; // IELTS band score 4.0 - 9.0
  createdAt: string;
  updatedAt: string;
}

// Idiom Types
export interface Idiom {
  id: string;
  idiom: string;
  meaning: string;
  examples: string[];
  relatedWords: string[];
  topics: string[];
  createdAt: string;
  updatedAt: string;
}

// Phrase Types
export interface Phrase {
  id: string;
  phrase: string;
  meaning: string;
  examples: string[];
  category: 'speaking' | 'writing' | 'general';
  topics: string[];
  createdAt: string;
  updatedAt: string;
}

// Topic Types
export interface Topic {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

// Skill Content Types
export interface SkillContent {
  id: string;
  title: string;
  slug: string;
  skill: 'listening' | 'reading' | 'speaking' | 'writing';
  content: string;
  relatedVocabulary: string[];
  audioUrl?: string;
  userAudioUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Filter Types
export interface VocabularyFilters {
  letter?: string;
  topic?: string;
  level?: string;
  band?: number;
  search?: string;
}

// Pagination Types
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
