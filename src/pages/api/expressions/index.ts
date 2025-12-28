import type { APIRoute } from 'astro';
import { expressionsRepo } from '../../../lib/repositories/expressions';
import { generateId } from '../../../lib/utils';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const type = url.searchParams.get('type');
    const topic = url.searchParams.get('topic');
    const category = url.searchParams.get('category');

    const filters: any = {};
    if (search) filters.search = search;
    if (type) filters.type = type;
    if (topic) filters.topic = topic;
    if (category) filters.category = category;

    const expressions = await expressionsRepo.getAll(filters);

    return new Response(JSON.stringify(expressions), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('GET /api/expressions error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch expressions' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    const newExpression = await expressionsRepo.create({
      id: generateId(),
      ...data,
    });

    return new Response(JSON.stringify(newExpression), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('POST /api/expressions error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create expression' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
