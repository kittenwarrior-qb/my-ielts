import type { APIRoute } from 'astro';
import { boardsRepo } from '../../../lib/repositories/boards';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const board = await boardsRepo.getById(id);

    if (!board) {
      return new Response(JSON.stringify({ error: 'Board not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(board), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('GET /api/boards/[id] error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch board' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
