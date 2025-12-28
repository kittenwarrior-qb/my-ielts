import type { APIRoute } from 'astro';
import { boardsRepo } from '../../../lib/repositories/boards';
import { generateId } from '../../../lib/utils';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');

    const filters: any = {};
    if (type) filters.type = type;

    const boards = await boardsRepo.getAll(filters);

    return new Response(JSON.stringify(boards), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('GET /api/boards error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch boards' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    const newBoard = await boardsRepo.create({
      id: generateId(),
      name: data.name,
      type: data.type,
      description: data.description || null,
      color: data.color || null,
      icon: data.icon || null,
      itemIds: [],
    });

    return new Response(JSON.stringify(newBoard), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('POST /api/boards error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create board' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
