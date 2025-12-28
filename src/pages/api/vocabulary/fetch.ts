import type { APIRoute } from 'astro';
import { requireAdmin } from '../../../lib/auth';
import { fetchWordFromDictionary } from '../../../lib/services/dictionaryApi';

export const POST: APIRoute = async ({ request, cookies }) => {
  // Check admin authentication
  if (!requireAdmin(cookies)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized. Admin access required.' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { word } = await request.json();

    if (!word || typeof word !== 'string') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Word parameter is required',
          type: 'VALIDATION_ERROR'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch from dictionary API
    const vocabularyData = await fetchWordFromDictionary(word.trim());

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: vocabularyData,
        message: 'Word fetched successfully from dictionary'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Dictionary fetch error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch word from dictionary';
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        type: 'API_FETCH_ERROR'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
