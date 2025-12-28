import { db } from '../db/client';
import { grammar } from '../db/schema';
import { eq, like, sql, and, or, inArray } from 'drizzle-orm';
import type { Grammar } from '../db/schema';

export interface GrammarFilters {
  level?: 'beginner' | 'intermediate' | 'advanced';
  topic?: string;
  search?: string;
}

export class GrammarRepository {
  async getAll(filters?: GrammarFilters): Promise<Grammar[]> {
    let query = db.select().from(grammar);

    const conditions = [];

    // Filter by level
    if (filters?.level) {
      conditions.push(eq(grammar.level, filters.level));
    }

    // Filter by topic
    if (filters?.topic) {
      conditions.push(
        sql`${grammar.topics}::jsonb @> ${JSON.stringify([filters.topic])}`
      );
    }

    // Search
    if (filters?.search) {
      const searchTerm = `%${filters.search.toLowerCase()}%`;
      conditions.push(
        or(
          sql`lower(${grammar.title}) LIKE ${searchTerm}`,
          sql`lower(${grammar.structure}) LIKE ${searchTerm}`,
          sql`lower(${grammar.explanation}) LIKE ${searchTerm}`
        )
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const results = await query;
    return results as Grammar[];
  }

  async getById(id: string): Promise<Grammar | null> {
    const results = await db
      .select()
      .from(grammar)
      .where(eq(grammar.id, id))
      .limit(1);

    return results[0] || null;
  }

  async getByIds(ids: string[]): Promise<Grammar[]> {
    if (ids.length === 0) return [];

    const results = await db
      .select()
      .from(grammar)
      .where(inArray(grammar.id, ids));

    return results as Grammar[];
  }

  async getByTitle(title: string): Promise<Grammar | null> {
    const results = await db
      .select()
      .from(grammar)
      .where(eq(grammar.title, title))
      .limit(1);

    return results[0] || null;
  }

  async create(data: Omit<Grammar, 'createdAt' | 'updatedAt'>): Promise<Grammar> {
    const now = new Date();
    const results = await db
      .insert(grammar)
      .values({
        ...data,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return results[0];
  }

  async update(id: string, data: Partial<Grammar>): Promise<Grammar | null> {
    const results = await db
      .update(grammar)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(grammar.id, id))
      .returning();

    return results[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const results = await db
      .delete(grammar)
      .where(eq(grammar.id, id))
      .returning();

    return results.length > 0;
  }

  async count(filters?: GrammarFilters): Promise<number> {
    const items = await this.getAll(filters);
    return items.length;
  }
}

export const grammarRepo = new GrammarRepository();
