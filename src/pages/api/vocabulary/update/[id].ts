import type { APIRoute } from 'astro';
import { vocabularyRepo } from '../../../../lib/repositories/vocabulary';
import { isAuthenticated } from '../../../../lib/auth';

export const POST: APIRoute = async ({ params, request, cookies }) => {
  // Check authentication
  if (!isAuthenticated(cookies)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { id } = params;

  if (!id) {
    return new Response(
      JSON.stringify({ success: false, error: 'ID is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
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

    // Update vocabulary
    const vocabulary = await vocabularyRepo.update(id, {
      word: data.word,
      phonetic: data.phonetic,
      audioUrl: data.audioUrl || null,
      types: data.types,
      examples: data.examples || [],
      synonyms: data.synonyms || [],
      wordForms: data.wordForms || [],
      topics: data.topics || [],
      level: data.level,
      band: data.band,
    });

    if (!vocabulary) {
      return new Response(
        JSON.stringify({ success: false, error: 'Vocabulary not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: vocabulary,
        message: 'Vocabulary updated successfully' 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Update vocabulary error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to update vocabulary' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
