import type { APIRoute } from 'astro';
import { boardsRepo } from '../../../lib/repositories/boards';
import { generateId } from '../../../lib/utils';
import { requireAuth, getAdminStatus } from '../../../lib/auth';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');

    const filters: any = {};
    if (type) filters.type = type;

    const boards = await boardsRepo.getAll(filters);

    return new Response(JSON.stringify(boards), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('GET /api/boards error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch boards' }), {
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
          error: 'Bạn cần đăng nhập để tạo board' 
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
          error: 'Bạn không có quyền tạo board. Chỉ admin mới có thể tạo board.' 
        }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.type) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Thiếu thông tin bắt buộc' 
        }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newBoard = await boardsRepo.create({
      id: generateId(),
      name: data.name,
      type: data.type,
      description: data.description || null,
      color: data.color || null,
      icon: data.icon || null,
      itemIds: [],
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        data: newBoard 
      }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('POST /api/boards error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Failed to create board' 
      }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
