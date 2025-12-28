/**
 * Dictionary API Service
 * Fetches word definitions from Free Dictionary API
 */

interface DictionaryAPIPhonetic {
  text?: string;
  audio?: string;
}

interface DictionaryAPIDefinition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

interface DictionaryAPIMeaning {
  partOfSpeech: string;
  definitions: DictionaryAPIDefinition[];
  synonyms?: string[];
  antonyms?: string[];
}

interface DictionaryAPIResponse {
  word: string;
  phonetic?: string;
  phonetics: DictionaryAPIPhonetic[];
  meanings: DictionaryAPIMeaning[];
  sourceUrls?: string[];
}

interface VocabularyData {
  word: string;
  phonetic: string;
  audioUrl: string | null;
  types: Array<{
    type: string;
    meanings: string[];
  }>;
  examples: string[];
  synonyms: string[];
  wordForms: string[];
  topics: string[];
  level: string;
  band: number;
  grammar: string | null;
}

// Simple in-memory cache
const cache = new Map<string, { data: Partial<VocabularyData>; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Fetch word data from Dictionary API
 */
export async function fetchWordFromDictionary(word: string): Promise<Partial<VocabularyData>> {
  // Check cache first
  const cached = cache.get(word.toLowerCase());
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Word "${word}" not found in dictionary`);
      }
      throw new Error(`Dictionary API error: ${response.status}`);
    }

    const data: DictionaryAPIResponse[] = await response.json();
    
    if (!data || data.length === 0) {
      throw new Error(`No data found for word "${word}"`);
    }

    const result = transformDictionaryResponse(data[0]);
    
    // Cache the result
    cache.set(word.toLowerCase(), {
      data: result,
      timestamp: Date.now(),
    });

    return result;
  } catch (error) {
    console.error('Dictionary API fetch error:', error);
    throw error;
  }
}

/**
 * Transform Dictionary API response to our vocabulary format
 */
function transformDictionaryResponse(
  apiResponse: DictionaryAPIResponse
): Partial<VocabularyData> {
  // Extract phonetic
  const phonetic = apiResponse.phonetic || 
    apiResponse.phonetics.find(p => p.text)?.text || 
    '';
  
  // Extract audio URL
  const audioUrl = apiResponse.phonetics.find(p => p.audio)?.audio || null;
  
  // Transform meanings to types format
  const types = apiResponse.meanings.map(meaning => ({
    type: meaning.partOfSpeech,
    meanings: meaning.definitions.slice(0, 3).map(d => d.definition), // Limit to 3 meanings per type
  }));
  
  // Extract examples
  const examples = apiResponse.meanings
    .flatMap(m => m.definitions)
    .filter(d => d.example)
    .map(d => d.example!)
    .slice(0, 5); // Limit to 5 examples
  
  // Extract synonyms
  const synonyms = [
    ...new Set([
      ...apiResponse.meanings.flatMap(m => m.synonyms || []),
      ...apiResponse.meanings
        .flatMap(m => m.definitions)
        .flatMap(d => d.synonyms || [])
    ])
  ].slice(0, 10); // Limit to 10 synonyms
  
  return {
    word: apiResponse.word,
    phonetic,
    audioUrl,
    types,
    examples,
    synonyms,
    wordForms: [], // Will be filled manually
    topics: ['General'], // Default topic
    level: 'intermediate', // Default level
    band: 6.0, // Default band
    grammar: null,
  };
}

/**
 * Clear cache (for testing or manual refresh)
 */
export function clearDictionaryCache(): void {
  cache.clear();
}
