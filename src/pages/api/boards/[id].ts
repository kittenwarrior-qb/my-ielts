import type { APIRoute } from 'astro';
import { boardsRepo } from '../../../lib/repositories/boards';
import { requireAuth, getAdminStatus } from '../../../lib/auth';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const board = await boardsRepo.getById(id);

    if (!board) {
      return new Response(JSON.stringify({ error: 'Board not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(board), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('GET /api/boards/[id] error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch board' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  try {
    // Check authentication
    if (!requireAuth(cookies)) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Bạn cần đăng nhập để chỉnh sửa board' 
        }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check admin permission
    const { isAdmin } = getAdminStatus(cookies);
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Bạn không có quyền chỉnh sửa board. Chỉ admin mới có thể chỉnh sửa board.' 
        }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { id } = params;
    
    if (!id) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'ID is required' 
        }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await request.json();

    const updatedBoard = await boardsRepo.update(id, {
      name: data.name,
      description: data.description,
    });

    if (!updatedBoard) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Board not found' 
        }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        data: updatedBoard 
      }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('PUT /api/boards/[id] error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Failed to update board' 
      }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
  try {
    // Check authentication
    if (!requireAuth(cookies)) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Bạn cần đăng nhập để xóa board' 
        }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check admin permission
    const { isAdmin } = getAdminStatus(cookies);
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Bạn không có quyền xóa board. Chỉ admin mới có thể xóa board.' 
        }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { id } = params;
    
    if (!id) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'ID is required' 
        }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const deleted = await boardsRepo.delete(id);

    if (!deleted) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Board not found' 
        }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Board deleted successfully' 
      }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('DELETE /api/boards/[id] error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Failed to delete board' 
      }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
