CREATE TABLE "lessons" (
	"id" text PRIMARY KEY NOT NULL,
	"board_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"order" integer DEFAULT 0 NOT NULL,
	"item_ids" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "boards" ADD COLUMN "order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "expressions" ADD COLUMN "external_links" jsonb;--> statement-breakpoint
ALTER TABLE "expressions" ADD COLUMN "context" jsonb;--> statement-breakpoint
ALTER TABLE "expressions" ADD COLUMN "synonyms" jsonb;--> statement-breakpoint
ALTER TABLE "grammar" ADD COLUMN "external_links" jsonb;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE cascade ON UPDATE no action;