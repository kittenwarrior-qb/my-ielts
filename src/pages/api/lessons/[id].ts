import type { APIRoute } from 'astro';
import { lessonsRepo } from '../../../lib/repositories/lessons';
import { requireAuth, getAdminStatus } from '../../../lib/auth';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Lesson ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const lesson = await lessonsRepo.getById(id);

    if (!lesson) {
      return new Response(JSON.stringify({ error: 'Lesson not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(lesson), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch lesson' }), {
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
          error: 'Bạn cần đăng nhập để chỉnh sửa lesson' 
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
          error: 'Bạn không có quyền chỉnh sửa lesson. Chỉ admin mới có thể chỉnh sửa lesson.' 
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

    const updatedLesson = await lessonsRepo.update(id, {
      title: data.title,
      description: data.description,
    });

    if (!updatedLesson) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Lesson not found' 
        }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        data: updatedLesson 
      }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('PUT /api/lessons/[id] error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Failed to update lesson' 
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
          error: 'Bạn cần đăng nhập để xóa lesson' 
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
          error: 'Bạn không có quyền xóa lesson. Chỉ admin mới có thể xóa lesson.' 
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

    const deleted = await lessonsRepo.delete(id);

    if (!deleted) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Lesson not found' 
        }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Lesson deleted successfully' 
      }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('DELETE /api/lessons/[id] error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Failed to delete lesson' 
      }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
