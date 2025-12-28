import type { APIRoute } from 'astro';
import { vocabularyRepo } from '../../../../lib/repositories/vocabulary';
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
    // Check if vocabulary exists
    const vocabulary = await vocabularyRepo.getById(id);
    if (!vocabulary) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Vocabulary not found',
          type: 'NOT_FOUND_ERROR'
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Remove from all boards (cascade deletion)
    const allBoards = await boardsRepo.getAll({ type: 'vocabulary' });
    for (const board of allBoards) {
      const itemIds = board.itemIds as string[];
      if (itemIds.includes(id)) {
        await boardsRepo.removeItem(board.id, id);
      }
    }

    // Delete vocabulary
    const deleted = await vocabularyRepo.delete(id);

    if (!deleted) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to delete vocabulary',
          type: 'DATABASE_ERROR'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Vocabulary deleted successfully' 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Delete vocabulary error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to delete vocabulary',
        type: 'DATABASE_ERROR'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
