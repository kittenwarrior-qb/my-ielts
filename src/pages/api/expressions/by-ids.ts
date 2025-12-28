import type { APIRoute } from 'astro';
import { expressionsRepo } from '../../../lib/repositories/expressions';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const idsParam = url.searchParams.get('ids');

    if (!idsParam) {
      return new Response(JSON.stringify({ error: 'Missing ids parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ids = idsParam.split(',').map(id => id.trim()).filter(Boolean);

    if (ids.length === 0) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const expressionItems = await expressionsRepo.getByIds(ids);

    return new Response(JSON.stringify(expressionItems), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('GET /api/expressions/by-ids error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch expression items' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
