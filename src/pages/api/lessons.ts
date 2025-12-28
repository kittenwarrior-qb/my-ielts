import type { APIRoute } from 'astro';
import { lessonsRepo } from '../../lib/repositories/lessons';
import { requireAuth, getAdminStatus } from '../../lib/auth';
import { generateId } from '../../lib/utils';

export const GET: APIRoute = async ({ url }) => {
  try {
    const boardId = url.searchParams.get('boardId');

    if (!boardId) {
      return new Response(JSON.stringify({ error: 'boardId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await lessonsRepo.getAll(boardId);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch lessons' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Check authentication
    if (!requireAuth(cookies)) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Bạn cần đăng nhập để tạo lesson' 
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
          error: 'Bạn không có quyền tạo lesson. Chỉ admin mới có thể tạo lesson.' 
        }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await request.json();

    if (!data.boardId || !data.title) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'boardId and title are required' 
        }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get current lessons count for order
    const existingLessons = await lessonsRepo.getAll(data.boardId);
    const order = existingLessons.length;

    const newLesson = await lessonsRepo.create({
      id: generateId(),
      boardId: data.boardId,
      title: data.title,
      description: data.description || null,
      order,
      itemIds: [],
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        data: newLesson 
      }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating lesson:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Failed to create lesson' 
      }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
