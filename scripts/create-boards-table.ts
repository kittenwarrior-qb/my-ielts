import { db } from '../src/lib/db/client';
import { sql } from 'drizzle-orm';

async function createBoardsTable() {
  try {
    // Create enum
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE "public"."board_type" AS ENUM('grammar', 'vocabulary', 'idioms');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "boards" (
        "id" text PRIMARY KEY NOT NULL,
        "name" text NOT NULL,
        "type" "board_type" NOT NULL,
        "description" text,
        "color" text,
        "icon" text,
        "item_ids" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `);

    console.log('Boards table created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating boards table:', error);
    process.exit(1);
  }
}

createBoardsTable();
