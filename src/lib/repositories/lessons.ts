import { db } from '../db/client';
import { lessons } from '../db/schema';
import { eq } from 'drizzle-orm';
import type { Lesson } from '../db/schema';

export class LessonsRepository {
  async getAll(boardId?: string): Promise<Lesson[]> {
    let query = db.select().from(lessons);

    if (boardId) {
      query = query.where(eq(lessons.boardId, boardId)) as any;
    }

    const results = await query.orderBy(lessons.order);
    return results as Lesson[];
  }

  async getById(id: string): Promise<Lesson | null> {
    const results = await db
      .select()
      .from(lessons)
      .where(eq(lessons.id, id))
      .limit(1);

    return results[0] || null;
  }

  async create(data: Omit<Lesson, 'createdAt' | 'updatedAt'>): Promise<Lesson> {
    const now = new Date();
    const results = await db
      .insert(lessons)
      .values({
        ...data,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return results[0];
  }

  async update(id: string, data: Partial<Lesson>): Promise<Lesson | null> {
    const results = await db
      .update(lessons)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(lessons.id, id))
      .returning();

    return results[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const results = await db
      .delete(lessons)
      .where(eq(lessons.id, id))
      .returning();

    return results.length > 0;
  }
}

export const lessonsRepo = new LessonsRepository();
