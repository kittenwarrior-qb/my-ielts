import type { APIRoute } from 'astro';
import { vocabularyRepo } from '../../../lib/repositories/vocabulary';
import { generateId } from '../../../lib/utils';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const topic = url.searchParams.get('topic');
    const level = url.searchParams.get('level');
    const band = url.searchParams.get('band');

    const filters: any = {};
    if (search) filters.search = search;
    if (topic) filters.topic = topic;
    if (level) filters.level = level;
    if (band) filters.band = parseFloat(band);

    const vocabulary = await vocabularyRepo.getAll(filters);

    return new Response(JSON.stringify(vocabulary), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('GET /api/vocabulary error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch vocabulary' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    const newVocabulary = await vocabularyRepo.create({
      id: generateId(),
      ...data,
    });

    return new Response(JSON.stringify(newVocabulary), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('POST /api/vocabulary error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create vocabulary' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
