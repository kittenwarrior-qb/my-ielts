import { db } from '../db/client';
import { boards } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import type { Board } from '../db/schema';

export type BoardType = 'grammar' | 'vocabulary' | 'idioms';

export interface BoardFilters {
  type?: BoardType;
}

export class BoardsRepository {
  async getAll(filters?: BoardFilters): Promise<Board[]> {
    let query = db.select().from(boards);

    if (filters?.type) {
      query = query.where(eq(boards.type, filters.type)) as any;
    }

    const results = await query;
    return results as Board[];
  }

  async getById(id: string): Promise<Board | null> {
    const results = await db
      .select()
      .from(boards)
      .where(eq(boards.id, id))
      .limit(1);

    return results[0] || null;
  }

  async create(data: Omit<Board, 'createdAt' | 'updatedAt'>): Promise<Board> {
    const now = new Date();
    const results = await db
      .insert(boards)
      .values({
        ...data,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return results[0];
  }

  async update(id: string, data: Partial<Board>): Promise<Board | null> {
    const results = await db
      .update(boards)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(boards.id, id))
      .returning();

    return results[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const results = await db
      .delete(boards)
      .where(eq(boards.id, id))
      .returning();

    return results.length > 0;
  }

  async count(filters?: BoardFilters): Promise<number> {
    const items = await this.getAll(filters);
    return items.length;
  }

  async addItem(boardId: string, itemId: string): Promise<Board | null> {
    const board = await this.getById(boardId);
    if (!board) return null;

    const itemIds = board.itemIds as string[];
    if (itemIds.includes(itemId)) return board;

    return this.update(boardId, {
      itemIds: [...itemIds, itemId],
    });
  }

  async removeItem(boardId: string, itemId: string): Promise<Board | null> {
    const board = await this.getById(boardId);
    if (!board) return null;

    const itemIds = board.itemIds as string[];
    return this.update(boardId, {
      itemIds: itemIds.filter(id => id !== itemId),
    });
  }
}

export const boardsRepo = new BoardsRepository();
