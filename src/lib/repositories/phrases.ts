import { db } from '../db/client';
import { phrases } from '../db/schema';
import { eq, like, sql, and, or } from 'drizzle-orm';
import type { Phrase } from '../db/schema';

export interface PhraseFilters {
  search?: string;
  category?: string;
  topic?: string;
}

export class PhrasesRepository {
  async getAll(filters?: PhraseFilters): Promise<Phrase[]> {
    let query = db.select().from(phrases);

    const conditions = [];

    if (filters?.category) {
      conditions.push(eq(phrases.category, filters.category as any));
    }

    if (filters?.topic) {
      conditions.push(
        sql`${phrases.topics}::jsonb @> ${JSON.stringify([filters.topic])}`
      );
    }

    if (filters?.search) {
      const searchTerm = `%${filters.search.toLowerCase()}%`;
      conditions.push(
        or(
          sql`lower(${phrases.phrase}) LIKE ${searchTerm}`,
          sql`lower(${phrases.meaning}) LIKE ${searchTerm}`,
          sql`lower(${phrases.examples}::text) LIKE ${searchTerm}`
        )
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const results = await query;
    return results as Phrase[];
  }

  async getById(id: string): Promise<Phrase | null> {
    const results = await db
      .select()
      .from(phrases)
      .where(eq(phrases.id, id))
      .limit(1);

    return results[0] || null;
  }

  async create(data: Omit<Phrase, 'createdAt' | 'updatedAt'>): Promise<Phrase> {
    const now = new Date();
    const results = await db
      .insert(phrases)
      .values({
        ...data,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return results[0];
  }

  async update(id: string, data: Partial<Phrase>): Promise<Phrase | null> {
    const results = await db
      .update(phrases)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(phrases.id, id))
      .returning();

    return results[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const results = await db
      .delete(phrases)
      .where(eq(phrases.id, id))
      .returning();

    return results.length > 0;
  }

  async getPaginated(
    page: number = 1,
    limit: number = 20,
    filters?: PhraseFilters
  ): Promise<{ items: Phrase[]; total: number; page: number; totalPages: number }> {
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

export const phrasesRepo = new PhrasesRepository();
