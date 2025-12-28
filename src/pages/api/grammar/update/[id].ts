import type { APIRoute } from 'astro';
import { grammarRepo } from '../../../../lib/repositories/grammar';
import { requireAdmin } from '../../../../lib/auth';

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  // Check admin authentication
  if (!requireAdmin(cookies)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized. Admin access required.' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { id } = params;

  if (!id) {
    return new Response(
      JSON.stringify({ success: false, error: 'ID is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.structure || !data.explanation || !data.level) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: title, structure, explanation, level',
          type: 'VALIDATION_ERROR'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update grammar
    const grammar = await grammarRepo.update(id, {
      title: data.title,
      structure: data.structure,
      explanation: data.explanation,
      examples: data.examples || [],
      usage: data.usage || null,
      notes: data.notes || null,
      topics: data.topics || [],
      level: data.level,
      externalLinks: data.externalLinks || null,
    });

    if (!grammar) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Grammar not found',
          type: 'NOT_FOUND_ERROR'
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: grammar,
        message: 'Grammar updated successfully' 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Update grammar error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to update grammar',
        type: 'DATABASE_ERROR'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
