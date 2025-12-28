import type { APIRoute } from 'astro';
import { expressionsRepo } from '../../../lib/repositories/expressions';
import { isAuthenticated } from '../../../lib/auth';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing id parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const expressionItem = await expressionsRepo.getById(id);

    if (!expressionItem) {
      return new Response(JSON.stringify({ error: 'Expression not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(expressionItem), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('GET /api/expressions/[id] error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch expression' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  // Check authentication and admin role
  const user = isAuthenticated(cookies);
  if (!user) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (user.role !== 'admin') {
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
    const data = await request.json();
    
    const updated = await expressionsRepo.update(id, data);

    if (updated) {
      return new Response(
        JSON.stringify(updated),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'Expression not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Update expression error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to update expression' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
  // Check authentication and admin role
  const user = isAuthenticated(cookies);
  if (!user) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (user.role !== 'admin') {
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
    const deleted = await expressionsRepo.delete(id);

    if (deleted) {
      return new Response(
        JSON.stringify({ success: true, message: 'Expression deleted successfully' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'Expression not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Delete expression error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to delete expression' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
