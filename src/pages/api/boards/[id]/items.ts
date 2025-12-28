import type { APIRoute } from 'astro';
import { boardsRepo } from '../../../../lib/repositories/boards';
import { isAuthenticated, requireAdmin } from '../../../../lib/auth';

export const POST: APIRoute = async ({ params, request, cookies }) => {
  // Check authentication and admin role
  if (!isAuthenticated(cookies)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!requireAdmin(cookies)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Admin access required' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { id } = params;

  if (!id) {
    return new Response(
      JSON.stringify({ success: false, error: 'Board ID is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { itemId } = await request.json();

    if (!itemId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Item ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const updatedBoard = await boardsRepo.addItem(id, itemId);

    if (!updatedBoard) {
      return new Response(
        JSON.stringify({ success: false, error: 'Board not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: updatedBoard }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Add item to board error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to add item to board' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
