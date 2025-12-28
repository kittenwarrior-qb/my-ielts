import type { APIRoute } from 'astro';
import { expressionsRepo } from '../../../../lib/repositories/expressions';
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
    if (!data.expression || !data.type || !data.meaning || !data.examples || data.examples.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: expression, type, meaning, examples',
          type: 'VALIDATION_ERROR'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update expression
    const expression = await expressionsRepo.update(id, {
      expression: data.expression,
      type: data.type,
      meaning: data.meaning,
      examples: data.examples,
      grammar: data.grammar || null,
      relatedWords: data.relatedWords || [],
      topics: data.topics || [],
      category: data.category || null,
      synonyms: data.synonyms || null,
      context: data.context || null,
      externalLinks: data.externalLinks || null,
    });

    if (!expression) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Expression not found',
          type: 'NOT_FOUND_ERROR'
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: expression,
        message: 'Expression updated successfully' 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Update expression error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to update expression',
        type: 'DATABASE_ERROR'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
