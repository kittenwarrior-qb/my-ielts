import type { APIRoute } from 'astro';
import { grammarRepo } from '../../../../lib/repositories/grammar';
import { boardsRepo } from '../../../../lib/repositories/boards';
import { requireAdmin } from '../../../../lib/auth';

export const DELETE: APIRoute = async ({ params, cookies }) => {
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
    // Check if grammar exists
    const grammar = await grammarRepo.getById(id);
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

    // Remove from all boards (cascade deletion)
    const allBoards = await boardsRepo.getAll({ type: 'grammar' });
    for (const board of allBoards) {
      const itemIds = board.itemIds as string[];
      if (itemIds.includes(id)) {
        await boardsRepo.removeItem(board.id, id);
      }
    }

    // Delete grammar
    const deleted = await grammarRepo.delete(id);

    if (!deleted) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to delete grammar',
          type: 'DATABASE_ERROR'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Grammar deleted successfully' 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Delete grammar error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to delete grammar',
        type: 'DATABASE_ERROR'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
