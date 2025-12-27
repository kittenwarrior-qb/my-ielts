import type { APIRoute } from 'astro';
import { vocabularyRepo } from '../../../lib/repositories/vocabulary';
import { isAuthenticated } from '../../../lib/auth';

export const DELETE: APIRoute = async ({ params, cookies }) => {
  // Check authentication
  if (!isAuthenticated(cookies)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
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
