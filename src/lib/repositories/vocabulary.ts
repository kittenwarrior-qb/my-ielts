import { db } from '../db/client';
import { vocabulary } from '../db/schema';
import { eq, like, sql, and, or, inArray } from 'drizzle-orm';
import type { Vocabulary } from '../db/schema';

export interface VocabularyFilters {
  letter?: string;
  topic?: string;
  level?: string;
  band?: number;
  search?: string;
}

export class VocabularyRepository {
  /**
   * Get all vocabulary with optional filters
   */
  async getAll(filters?: VocabularyFilters): Promise<Vocabulary[]> {
    let query = db.select().from(vocabulary);

    const conditions = [];

    // Filter by first letter
    if (filters?.letter) {
      conditions.push(
        sql`lower(${vocabulary.word}) LIKE ${filters.letter.toLowerCase() + '%'}`
      );
    }

    // Filter by topic (check if topic exists in jsonb array)
    if (filters?.topic) {
      conditions.push(
        sql`${vocabulary.topics}::jsonb @> ${JSON.stringify([filters.topic])}`
      );
    }

    // Filter by level
    if (filters?.level) {
      conditions.push(eq(vocabulary.level, filters.level as any));
    }

    // Filter by minimum band score
    if (filters?.band) {
      conditions.push(sql`${vocabulary.band} >= ${filters.band}`);
    }

    // Search in word, meanings, examples
    if (filters?.search) {
      const searchTerm = `%${filters.search.toLowerCase()}%`;
      conditions.push(
        or(
          sql`lower(${vocabulary.word}) LIKE ${searchTerm}`,
          sql`lower(${vocabulary.phonetic}) LIKE ${searchTerm}`,
          sql`lower(${vocabulary.types}::text) LIKE ${searchTerm}`,
          sql`lower(${vocabulary.examples}::text) LIKE ${searchTerm}`
        )
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const results = await query;
    return results as Vocabulary[];
  }

  /**
   * Get vocabulary by word
   */
  async getByWord(word: string): Promise<Vocabulary | null> {
    const results = await db
      .select()
      .from(vocabulary)
      .where(eq(vocabulary.word, word))
      .limit(1);

    return results[0] || null;
  }

  /**
   * Get vocabulary by ID
   */
  async getById(id: string): Promise<Vocabulary | null> {
    const results = await db
      .select()
      .from(vocabulary)
      .where(eq(vocabulary.id, id))
      .limit(1);

    return results[0] || null;
  }

  /**
   * Create new vocabulary
   */
  async create(data: Omit<Vocabulary, 'createdAt' | 'updatedAt'>): Promise<Vocabulary> {
    const now = new Date();
    const results = await db
      .insert(vocabulary)
      .values({
        ...data,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return results[0];
  }

  /**
   * Update vocabulary
   */
  async update(id: string, data: Partial<Vocabulary>): Promise<Vocabulary | null> {
    const results = await db
      .update(vocabulary)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(vocabulary.id, id))
      .returning();

    return results[0] || null;
  }

  /**
   * Delete vocabulary
   */
  async delete(id: string): Promise<boolean> {
    const results = await db
      .delete(vocabulary)
      .where(eq(vocabulary.id, id))
      .returning();

    return results.length > 0;
  }

  /**
   * Get vocabulary count
   */
  async count(filters?: VocabularyFilters): Promise<number> {
    const items = await this.getAll(filters);
    return items.length;
  }

  /**
   * Get paginated vocabulary
   */
  async getPaginated(
    page: number = 1,
    limit: number = 20,
    filters?: VocabularyFilters
  ): Promise<{ items: Vocabulary[]; total: number; page: number; totalPages: number }> {
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

// Export singleton instance
export const vocabularyRepo = new VocabularyRepository();
