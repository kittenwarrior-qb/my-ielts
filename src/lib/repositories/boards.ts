import { db } from '../db/client';
import { boards } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import type { Board } from '../db/schema';
import { vocabularyRepo } from './vocabulary';
import { expressionsRepo } from './expressions';
import { grammarRepo } from './grammar';
import { lessonsRepo } from './lessons';

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

    const results = await query.orderBy(boards.order);
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
    // Get board first to access its items
    const board = await this.getById(id);
    if (!board) return false;

    // For grammar boards, delete all lessons and their items first
    if (board.type === 'grammar') {
      const boardLessons = await lessonsRepo.getAll(id);
      console.log(`Found ${boardLessons.length} lessons in grammar board "${board.name}"`);
      
      for (const lesson of boardLessons) {
        const lessonItemIds = Array.isArray(lesson.itemIds) ? lesson.itemIds : [];
        
        if (lessonItemIds.length > 0) {
          console.log(`Deleting ${lessonItemIds.length} grammar items from lesson "${lesson.title}"...`);
          for (const itemId of lessonItemIds) {
            await grammarRepo.delete(itemId as string);
          }
        }
        
        // Delete the lesson itself
        console.log(`Deleting lesson "${lesson.title}"...`);
        await lessonsRepo.delete(lesson.id);
      }
    }

    // Delete all items in the board based on board type
    const itemIds = Array.isArray(board.itemIds) ? board.itemIds : [];
    
    if (itemIds.length > 0) {
      if (board.type === 'vocabulary') {
        // Delete vocabulary items
        console.log(`Deleting ${itemIds.length} vocabulary items from board "${board.name}"...`);
        for (const itemId of itemIds) {
          await vocabularyRepo.delete(itemId as string);
        }
      } else if (board.type === 'idioms') {
        // Delete expression items
        console.log(`Deleting ${itemIds.length} expression items from board "${board.name}"...`);
        for (const itemId of itemIds) {
          await expressionsRepo.delete(itemId as string);
        }
      } else if (board.type === 'grammar') {
        // Delete grammar items directly in board (if any)
        console.log(`Deleting ${itemIds.length} grammar items from board "${board.name}"...`);
        for (const itemId of itemIds) {
          await grammarRepo.delete(itemId as string);
        }
      }
    }

    // Delete the board itself
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
