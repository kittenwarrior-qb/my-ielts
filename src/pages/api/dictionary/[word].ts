import type { APIRoute } from 'astro';
import { fetchWordFromDictionary } from '../../../lib/dictionary';

export const GET: APIRoute = async ({ params }) => {
  const { word } = params;

  if (!word) {
    return new Response(
      JSON.stringify({ success: false, error: 'Word parameter is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const data = await fetchWordFromDictionary(word);

    if (!data) {
      return new Response(
        JSON.stringify({ success: false, error: 'Word not found in dictionary' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Dictionary API error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch word data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
