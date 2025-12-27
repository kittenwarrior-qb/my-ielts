import type { APIRoute } from 'astro';
import { vocabularyRepo } from '../../../lib/repositories/vocabulary';
import { isAuthenticated } from '../../../lib/auth';
import { generateId } from '../../../lib/utils';

export const POST: APIRoute = async ({ request, cookies }) => {
  // Check authentication
  if (!isAuthenticated(cookies)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const data = await request.json();

    // Validate required fields
    if (!data.word || !data.phonetic || !data.types || !data.level || !data.band) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create vocabulary
    const vocabulary = await vocabularyRepo.create({
      id: generateId(),
      word: data.word,
      phonetic: data.phonetic,
      audioUrl: data.audioUrl || null,
      userAudioUrl: null,
      types: data.types,
      examples: data.examples || [],
      synonyms: data.synonyms || [],
      wordForms: data.wordForms || [],
      topics: data.topics || [],
      level: data.level,
      band: data.band,
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: vocabulary,
        message: 'Vocabulary created successfully' 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Create vocabulary error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to create vocabulary' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
