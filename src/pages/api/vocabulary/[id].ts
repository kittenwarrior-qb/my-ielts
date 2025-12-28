import type { APIRoute } from 'astro';
import { vocabularyRepo } from '../../../lib/repositories/vocabulary';
import { isAuthenticated, requireAdmin } from '../../../lib/auth';

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  // Check authentication and admin role
  if (!isAuthenticated(cookies)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!requireAdmin(cookies)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Bạn không có quyền thực hiện thao tác này' }),
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
    const payload = await request.json();
    
    console.log('Update vocabulary payload:', JSON.stringify(payload, null, 2));
    
    let vocabularyData;
    
    // Handle different input methods
    if (payload.method === 'json') {
      // Parse JSON string
      try {
        vocabularyData = JSON.parse(payload.json);
        console.log('Parsed JSON data:', vocabularyData);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid JSON format' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } else if (payload.method === 'manual') {
      // Use manual form data
      vocabularyData = payload.data;
      console.log('Manual form data:', vocabularyData);
    } else {
      // Backward compatibility: if no method specified, treat as direct data
      vocabularyData = payload;
      console.log('Direct data (backward compatible):', vocabularyData);
    }
    
    console.log('Updating vocabulary with ID:', id);
    const updated = await vocabularyRepo.update(id, vocabularyData);
    console.log('Update result:', updated);

    if (updated) {
      return new Response(
        JSON.stringify({ success: true, data: updated }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'Vocabulary not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Update vocabulary error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to update vocabulary', details: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
  // Check authentication and admin role
  if (!isAuthenticated(cookies)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!requireAdmin(cookies)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Bạn không có quyền thực hiện thao tác này' }),
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
    const deleted = await vocabularyRepo.delete(id);

    if (deleted) {
      return new Response(
        JSON.stringify({ success: true, message: 'Vocabulary deleted successfully' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'Vocabulary not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Delete vocabulary error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to delete vocabulary' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
