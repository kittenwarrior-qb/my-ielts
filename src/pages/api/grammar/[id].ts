import type { APIRoute } from 'astro';
import { grammarRepo } from '../../../lib/repositories/grammar';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing id parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const grammarItem = await grammarRepo.getById(id);

    if (!grammarItem) {
      return new Response(JSON.stringify({ error: 'Grammar item not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(grammarItem), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('GET /api/grammar/[id] error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch grammar item' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing id parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await request.json();
    const updatedGrammar = await grammarRepo.update(id, data);

    if (!updatedGrammar) {
      return new Response(JSON.stringify({ error: 'Grammar item not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(updatedGrammar), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('PUT /api/grammar/[id] error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update grammar item' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing id parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const deleted = await grammarRepo.delete(id);

    if (!deleted) {
      return new Response(JSON.stringify({ error: 'Grammar item not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('DELETE /api/grammar/[id] error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete grammar item' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
