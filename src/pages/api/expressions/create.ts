import type { APIRoute } from 'astro';
import { expressionsRepo } from '../../../lib/repositories/expressions';
import { requireAdmin } from '../../../lib/auth';
import { generateId } from '../../../lib/utils';

export const POST: APIRoute = async ({ request, cookies }) => {
  // Check admin authentication
  if (!requireAdmin(cookies)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized. Admin access required.' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();
    const { method = 'manual', data, json } = body;

    let expressionData;

    // Process based on input method
    if (method === 'json' && json) {
      try {
        expressionData = JSON.parse(json);
      } catch (parseError) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Invalid JSON format',
            type: 'JSON_PARSE_ERROR',
            details: parseError instanceof Error ? parseError.message : 'Unknown error'
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } else if (method === 'manual') {
      expressionData = data;
    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid method specified' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate required fields
    if (!expressionData.expression || !expressionData.type || !expressionData.meaning || 
        !expressionData.examples || expressionData.examples.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: expression, type, meaning, examples',
          type: 'VALIDATION_ERROR'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check for duplicate expression
    const existing = await expressionsRepo.getByExpression(expressionData.expression);
    if (existing) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Expression "${expressionData.expression}" already exists`,
          type: 'DUPLICATE_ERROR',
          existingId: existing.id
        }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create expression
    const expression = await expressionsRepo.create({
      id: generateId(),
      expression: expressionData.expression,
      type: expressionData.type,
      meaning: expressionData.meaning,
      examples: expressionData.examples,
      grammar: expressionData.grammar || null,
      relatedWords: expressionData.relatedWords || [],
      topics: expressionData.topics || [],
      category: expressionData.category || null,
      synonyms: expressionData.synonyms || null,
      context: expressionData.context || null,
      externalLinks: expressionData.externalLinks || null,
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: expression,
        message: 'Expression created successfully' 
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Create expression error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to create expression',
        type: 'DATABASE_ERROR'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
