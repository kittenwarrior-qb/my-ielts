import { db } from '../db/client';
import { expressions } from '../db/schema';
import { eq, like, sql, and, or, inArray } from 'drizzle-orm';
import type { Expression } from '../db/schema';

export interface ExpressionFilters {
  type?: 'idiom' | 'phrase';
  topic?: string;
  category?: string;
  search?: string;
}

export class ExpressionsRepository {
  async getAll(filters?: ExpressionFilters): Promise<Expression[]> {
    let query = db.select().from(expressions);

    const conditions = [];

    // Filter by type
    if (filters?.type) {
      conditions.push(eq(expressions.type, filters.type));
    }

    // Filter by topic
    if (filters?.topic) {
      conditions.push(
        sql`${expressions.topics}::jsonb @> ${JSON.stringify([filters.topic])}`
      );
    }

    // Filter by category
    if (filters?.category) {
      conditions.push(eq(expressions.category, filters.category));
    }

    // Search
    if (filters?.search) {
      const searchTerm = `%${filters.search.toLowerCase()}%`;
      conditions.push(
        or(
          sql`lower(${expressions.expression}) LIKE ${searchTerm}`,
          sql`lower(${expressions.meaning}) LIKE ${searchTerm}`,
          sql`lower(${expressions.examples}::text) LIKE ${searchTerm}`
        )
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const results = await query;
    return results as Expression[];
  }

  async getByIds(ids: string[]): Promise<Expression[]> {
    if (ids.length === 0) return [];

    const results = await db
      .select()
      .from(expressions)
      .where(inArray(expressions.id, ids));

    return results as Expression[];
  }

  async getById(id: string): Promise<Expression | null> {
    const results = await db
      .select()
      .from(expressions)
      .where(eq(expressions.id, id))
      .limit(1);

    return results[0] || null;
  }

  async getByExpression(expression: string): Promise<Expression | null> {
    const results = await db
      .select()
      .from(expressions)
      .where(eq(expressions.expression, expression))
      .limit(1);

    return results[0] || null;
  }

  async create(data: Omit<Expression, 'createdAt' | 'updatedAt'>): Promise<Expression> {
    const now = new Date();
    const results = await db
      .insert(expressions)
      .values({
        ...data,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return results[0];
  }

  async update(id: string, data: Partial<Expression>): Promise<Expression | null> {
    const results = await db
      .update(expressions)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(expressions.id, id))
      .returning();

    return results[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const results = await db
      .delete(expressions)
      .where(eq(expressions.id, id))
      .returning();

    return results.length > 0;
  }

  async count(filters?: ExpressionFilters): Promise<number> {
    const items = await this.getAll(filters);
    return items.length;
  }
}

export const expressionsRepo = new ExpressionsRepository();
