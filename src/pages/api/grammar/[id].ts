import type { APIRoute } from 'astro';
import { grammarRepo } from '../../../lib/repositories/grammar';
import { isAuthenticated, requireAdmin } from '../../../lib/auth';

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

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  // Check authentication and admin role
  if (!isAuthenticated(cookies)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!requireAdmin(cookies)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Bạn không có quyền thực hiện thao tác này' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ success: false, error: 'Missing id parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { method = 'manual', data, json } = body;

    let grammarData;

    // Process based on input method
    if (method === 'json' && json) {
      try {
        grammarData = JSON.parse(json);
      } catch (parseError) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Invalid JSON format',
            details: parseError instanceof Error ? parseError.message : 'Unknown error'
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } else if (method === 'manual') {
      grammarData = data;
    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid method specified' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const updatedGrammar = await grammarRepo.update(id, grammarData);

    if (!updatedGrammar) {
      return new Response(JSON.stringify({ success: false, error: 'Grammar item not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, data: updatedGrammar }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('PUT /api/grammar/[id] error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to update grammar item' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
  // Check authentication and admin role
  if (!isAuthenticated(cookies)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!requireAdmin(cookies)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Bạn không có quyền thực hiện thao tác này' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ success: false, error: 'Missing id parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const deleted = await grammarRepo.delete(id);

    if (!deleted) {
      return new Response(JSON.stringify({ success: false, error: 'Grammar item not found' }), {
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
    return new Response(JSON.stringify({ success: false, error: 'Failed to delete grammar item' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
