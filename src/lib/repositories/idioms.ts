import { db } from '../db/client';
import { idioms } from '../db/schema';
import { eq, like, sql, and, or } from 'drizzle-orm';
import type { Idiom } from '../db/schema';

export interface IdiomFilters {
  search?: string;
  topic?: string;
}

export class IdiomsRepository {
  async getAll(filters?: IdiomFilters): Promise<Idiom[]> {
    let query = db.select().from(idioms);

    const conditions = [];

    if (filters?.topic) {
      conditions.push(
        sql`${idioms.topics}::jsonb @> ${JSON.stringify([filters.topic])}`
      );
    }

    if (filters?.search) {
      const searchTerm = `%${filters.search.toLowerCase()}%`;
      conditions.push(
        or(
          sql`lower(${idioms.idiom}) LIKE ${searchTerm}`,
          sql`lower(${idioms.meaning}) LIKE ${searchTerm}`,
          sql`lower(${idioms.examples}::text) LIKE ${searchTerm}`
        )
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const results = await query;
    return results as Idiom[];
  }

  async getById(id: string): Promise<Idiom | null> {
    const results = await db
      .select()
      .from(idioms)
      .where(eq(idioms.id, id))
      .limit(1);

    return results[0] || null;
  }

  async create(data: Omit<Idiom, 'createdAt' | 'updatedAt'>): Promise<Idiom> {
    const now = new Date();
    const results = await db
      .insert(idioms)
      .values({
        ...data,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return results[0];
  }

  async update(id: string, data: Partial<Idiom>): Promise<Idiom | null> {
    const results = await db
      .update(idioms)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(idioms.id, id))
      .returning();

    return results[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const results = await db
      .delete(idioms)
      .where(eq(idioms.id, id))
      .returning();

    return results.length > 0;
  }

  async getPaginated(
    page: number = 1,
    limit: number = 20,
    filters?: IdiomFilters
  ): Promise<{ items: Idiom[]; total: number; page: number; totalPages: number }> {
    const allItems = await this.getAll(filters);
    const total = allItems.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const items = allItems.slice(offset, offset + limit);

    return {
      items,
      total,
      page,
      totalPages,
    };
  }
}

export const idiomsRepo = new IdiomsRepository();
