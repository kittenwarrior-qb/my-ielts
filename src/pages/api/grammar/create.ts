import type { APIRoute } from 'astro';
import { grammarRepo } from '../../../lib/repositories/grammar';
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
            type: 'JSON_PARSE_ERROR',
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

    // Validate required fields
    if (!grammarData.title || !grammarData.structure || !grammarData.explanation || !grammarData.level) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: title, structure, explanation, level',
          type: 'VALIDATION_ERROR'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check for duplicate title
    const existing = await grammarRepo.getByTitle(grammarData.title);
    if (existing) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Grammar "${grammarData.title}" already exists`,
          type: 'DUPLICATE_ERROR',
          existingId: existing.id
        }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create grammar
    const grammar = await grammarRepo.create({
      id: generateId(),
      title: grammarData.title,
      structure: grammarData.structure,
      explanation: grammarData.explanation,
      examples: grammarData.examples || [],
      usage: grammarData.usage || null,
      notes: grammarData.notes || null,
      topics: grammarData.topics || [],
      level: grammarData.level,
      externalLinks: grammarData.externalLinks || null,
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: grammar,
        message: 'Grammar created successfully' 
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Create grammar error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to create grammar',
        type: 'DATABASE_ERROR'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
