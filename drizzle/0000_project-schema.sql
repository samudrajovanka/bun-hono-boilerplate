CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "projects_name_idx" ON "projects" USING btree ("name");