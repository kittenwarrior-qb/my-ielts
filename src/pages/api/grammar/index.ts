import type { APIRoute } from 'astro';
import { grammarRepo } from '../../../lib/repositories/grammar';
import { generateId } from '../../../lib/utils';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const topic = url.searchParams.get('topic');
    const level = url.searchParams.get('level');

    const filters: any = {};
    if (search) filters.search = search;
    if (topic) filters.topic = topic;
    if (level) filters.level = level;

    const grammarItems = await grammarRepo.getAll(filters);

    return new Response(JSON.stringify(grammarItems), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('GET /api/grammar error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch grammar items' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    const newGrammar = await grammarRepo.create({
      id: generateId(),
      ...data,
    });

    return new Response(JSON.stringify(newGrammar), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('POST /api/grammar error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create grammar item' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
