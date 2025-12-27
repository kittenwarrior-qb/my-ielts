// Free Dictionary API service
// https://dictionaryapi.dev/

export interface DictionaryApiResponse {
  word: string;
  phonetic?: string;
  phonetics: Array<{
    text?: string;
    audio?: string;
  }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms?: string[];
      antonyms?: string[];
    }>;
  }>;
}

export interface ParsedWordData {
  word: string;
  phonetic: string;
  audioUrl: string;
  types: Array<{
    type: string;
    meanings: string[];
  }>;
  examples: string[];
  synonyms: string[];
}

/**
 * Fetch word data from Free Dictionary API
 */
export async function fetchWordFromDictionary(word: string): Promise<ParsedWordData | null> {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`
    );

    if (!response.ok) {
      console.error(`Dictionary API error: ${response.status}`);
      return null;
    }

    const data: DictionaryApiResponse[] = await response.json();
    
    if (!data || data.length === 0) {
      return null;
    }

    const wordData = data[0];

    // Extract phonetic (prefer with audio)
    const phoneticWithAudio = wordData.phonetics.find(p => p.audio && p.text);
    const phonetic = phoneticWithAudio?.text || wordData.phonetic || wordData.phonetics[0]?.text || '';

    // Extract audio URL (prefer US pronunciation)
    const audioUrl = wordData.phonetics.find(p => p.audio?.includes('-us.'))?.audio ||
                     wordData.phonetics.find(p => p.audio)?.audio || '';

    // Extract meanings by part of speech
    const types = wordData.meanings.map(meaning => ({
      type: normalizePartOfSpeech(meaning.partOfSpeech),
      meanings: meaning.definitions.slice(0, 3).map(def => def.definition), // Take top 3 definitions
    }));

    // Extract examples (max 5)
    const examples: string[] = [];
    for (const meaning of wordData.meanings) {
      for (const def of meaning.definitions) {
        if (def.example && examples.length < 5) {
          examples.push(def.example);
        }
      }
    }

    // Extract synonyms (max 10)
    const synonymsSet = new Set<string>();
    for (const meaning of wordData.meanings) {
      for (const def of meaning.definitions) {
        if (def.synonyms) {
          def.synonyms.forEach(syn => synonymsSet.add(syn));
        }
      }
      if (synonymsSet.size >= 10) break;
    }

    return {
      word: wordData.word,
      phonetic,
      audioUrl,
      types,
      examples,
      synonyms: Array.from(synonymsSet).slice(0, 10),
    };
  } catch (error) {
    console.error('Error fetching word from dictionary:', error);
    return null;
  }
}

/**
 * Normalize part of speech to match our schema
 */
function normalizePartOfSpeech(pos: string): string {
  const mapping: Record<string, string> = {
    'noun': 'noun',
    'verb': 'verb',
    'adjective': 'adjective',
    'adverb': 'adverb',
    'preposition': 'preposition',
    'conjunction': 'conjunction',
    'interjection': 'interjection',
    'pronoun': 'pronoun',
  };

  return mapping[pos.toLowerCase()] || pos;
}

/**
 * Test function to check if API is working
 */
export async function testDictionaryApi() {
  const testWords = ['abundant', 'beneficial', 'comprehensive'];
  
  console.log('Testing Dictionary API...\n');
  
  for (const word of testWords) {
    console.log(`Fetching: ${word}`);
    const data = await fetchWordFromDictionary(word);
    
    if (data) {
      console.log(`✅ ${data.word} - ${data.phonetic}`);
      console.log(`   Audio: ${data.audioUrl ? '✓' : '✗'}`);
      console.log(`   Types: ${data.types.length}`);
      console.log(`   Examples: ${data.examples.length}`);
      console.log(`   Synonyms: ${data.synonyms.length}\n`);
    } else {
      console.log(`❌ Failed to fetch ${word}\n`);
    }
  }
}
