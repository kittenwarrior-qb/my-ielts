import type { APIRoute } from 'astro';
import { lessonsRepo } from '../../../../lib/repositories/lessons';
import { requireAuth, getAdminStatus } from '../../../../lib/auth';

export const POST: APIRoute = async ({ params, request, cookies }) => {
  try {
    // Check authentication
    if (!requireAuth(cookies)) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Bạn cần đăng nhập' 
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
          error: 'Bạn không có quyền cập nhật lesson' 
        }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Lesson ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await request.json();
    const updatedLesson = await lessonsRepo.update(id, data);

    if (!updatedLesson) {
      return new Response(JSON.stringify({ error: 'Lesson not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, data: updatedLesson }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating lesson:', error);
    return new Response(JSON.stringify({ error: 'Failed to update lesson' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
