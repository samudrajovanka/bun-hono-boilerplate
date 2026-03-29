<div align="center">

# Bun + Hono Boilerplate

Lightweight, modular REST API starter built on the Bun runtime, the Hono framework, Drizzle ORM (PostgreSQL), Zod validation, and a clean service/controller pattern. Includes pagination, structured error handling, logging, secure headers, CORS, and formatting/linting via Biome with optional Git hooks via Lefthook.

</div>

## Table of Contents
1. Overview
2. Tech Stack & Features
3. Directory Structure
4. Getting Started
5. Environment Variables
6. Scripts
7. Database & Migrations (Drizzle)
8. HTTP Lifecycle & Middlewares
9. Validation Pattern (Zod)
10. Error Handling & Response Format
11. Pagination
12. Adding a New Module
13. Logging
14. Roadmap / Next Steps
15. Contributing

---

## 1. Overview
This boilerplate is designed to help you build APIs quickly with type safety and clear separation of concerns:
- Route layer wires endpoints.
- Controller layer handles request/response formatting and validation.
- Service layer encapsulates business logic & DB access.
- Schema layer defines Drizzle models (PostgreSQL tables).
- Shared helpers cover pagination, error shaping, and standardized responses.

## 2. Tech Stack & Features
- Runtime: Bun
- Framework: Hono (fast, minimal)
- ORM: Drizzle ORM (PostgreSQL) + generated SQL migrations
- Validation: Zod + `@hono/zod-validator`
- Database Pool: `pg`
- Formatting/Linting: Biome
- Git Hooks (optional): Lefthook (`prepare:install` script)
- Error Handling: Custom error classes (`ClientError`, `ConflictError`, etc.) + unified handler
- Pagination: Query param validator + meta generator
- Security: `secure-headers`, CORS configuration
- Logging: Simple per-request timing & metadata

## 3. Directory Structure

```
.
├── drizzle/                # Generated SQL migrations & metadata
├── src/                    # Application source code
│   ├── config/             # Runtime/service configs
│   ├── constants/          # Static constant maps
│   ├── exceptions/         # Custom error classes
│   ├── middlewares/        # Global/request middlewares
│   ├── modules/            # Feature modules (domain isolated)
│   │   └── <module>/       # Example domain module
│   │       ├── <module>.schema.ts     # Drizzle table definition
│   │       ├── <module>.validator.ts  # Zod payload/query validators
│   │       ├── <module>.service.ts    # Business logic & DB queries
│   │       ├── <module>.controller.ts # Request handlers (validation -> service -> response)
│   │       ├── <module>.route.ts      # Hono route bindings
│   │       └── types.ts               # Module-specific shared types
│   ├── routes/             # API composition layer
│   ├── schemas/            # Re-export table schemas for Drizzle
│   ├── types/              # Shared cross-cutting types
│   ├── utils/              # Helpers (pagination, response, etc.)
│   └── index.ts            # Hono app setup & export
├── .env                    # Local environment variables (gitignored)
├── .env.example            # Template of required env vars
├── .gitignore              # VCS ignore rules
├── biome.json              # Biome formatter/linter config
├── bun.lock                # Bun lockfile
├── docker-compose.yml      # Optional service orchestration (Postgres, etc.)
├── Dockerfile              # Container image definition
├── drizzle.config.ts       # Drizzle migration generation config
├── entrypoint.sh           # Docker/container entrypoint script
├── lefthook.yml            # Git hooks configuration
├── package.json            # Dependencies & scripts
├── README.md               # Project documentation
└── tsconfig.json           # TypeScript compiler options
```

## 4. Getting Started
Prerequisites:
- Bun installed: https://bun.sh
- PostgreSQL running locally (or via Docker).

Install dependencies:
```sh
bun install
```

Run development server (hot reload & `.env` loading):
```sh
bun dev
```
Default port fallback is `5000` if `PORT` is not set. Open: `http://localhost:<PORT>/api/projects`.

## 5. Environment Variables
Create a `.env` file in the project root (same level as `package.json`). Required variables used in code:
```
PORT=5000
PG_HOST=localhost
PG_PORT=5432
PG_USER=your_user
PG_PASSWORD=your_password
PG_DATABASE=your_database
ALLOWED_CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```
Adjust CORS origins as needed. Empty `ALLOWED_CORS_ORIGINS` allows none.

## 6. Scripts
From `package.json`:
| Script | Purpose |
|--------|---------|
| `dev` | Start dev server with hot reload |
| `prepare:install` | Install Lefthook git hooks |
| `biome:format` | Format code (in-place) |
| `biome:lint` | Lint and auto-fix |
| `biome:check` | Combined checks |
| `db:generate` | Generate migrations from schema changes |
| `db:migrate` | Apply pending migrations to the database |
| `db:seed` | Seed the database |
| `generate` | Interactive module generator (Plop) |
| `generate:module:all` | Generate module with all files (non-interactive) |

## 7. Database & Migrations (Drizzle)
Workflow:
1. Define / modify table schemas in `src/modules/<module>/<module>.schema.ts` using `pgTable`.
2. Ensure schema is exported via `src/schemas/index.ts` (re-export new table).
3. Generate SQL migration: `bun run db:generate --name=<name-of-migration>` (writes files under `drizzle/`).
4. Apply migration: `bun run db:migrate`.
5. Use `db` from `src/config/db.ts` inside services.

Drizzle folder note:
The `drizzle/` directory included in this boilerplate is only an example snapshot (initial migration + meta). If you are starting a brand‑new project you can safely remove it and regenerate fresh migrations.

Then recreate after defining your schemas:
```sh
bun run db:generate --name=init
bun run db:migrate
```
Drizzle will rebuild the folder with new migration SQL and metadata. Avoid manually editing files inside `drizzle/`; always regenerate via the CLI for consistency.

Helper snippets:
```ts
// Example base columns from helpers/schema.ts
export const baseColumns = {
  ...timestamps,
  id: uuid('id').default(sql`gen_random_uuidv7()`).primaryKey()
};
```

## 8. HTTP Lifecycle & Middlewares
Global middlewares in `src/index.ts`:
- `secureHeaders()` sets common security headers.
- `trimTrailingSlash()` normalizes URL paths.
- `logMiddleware` logs request meta & duration.
Error handling:
- `notFound` -> returns standardized 404 JSON.
- `onError` -> delegates to `errorHandler` (client vs server errors).

## 9. Validation Pattern (Zod)
- Use Zod schemas + `validationMiddleware(target, schema)` wrapper (`middlewares/validation.ts`).
- Attach validators in controllers via `createFactory().createHandlers(<validator>, async (c) => { ... })`.
- Example pagination query validator (`utils/validators/paginationParams.ts`) transforms strings to numbers and enforces positivity.
- On failure, a `ClientError` with type `VALIDATION_ERR` is thrown and serialized.

## 10. Error Handling & Response Format
Error classes under `src/exceptions/` unify patterns (e.g., `ConflictError`, `NotFoundError`).
`errorHandler` distinguishes:
- Client-side known errors (status + type + optional `validations`).
- Server errors (hidden stack in production).

Response helpers in `utils/helpers/response.ts`:
```jsonc
// successResponse
{
	"success": true,
	"message": "Success create project",
	"data": { "project": { /* ... */ } },
	"meta": { "pagination": { /* optional */ } }
}
// clientErrorResponse
{
	"success": false,
	"message": "Validation error",
	"type": "VALIDATION_ERR",
	"validations": { "name": "Required" }
}
```

## 11. Pagination
- Validator: `zPaginationParamsValidator` (query params `page`, `limit` default to 1 / 10).
- Helper `getPaginationFromQuery(c)` returns `{ page, limit, offset }`.
- Meta via `generatePaginationMetaResponse` -> `{ page, limit, total, totalPages }`.
Usage in controller:
```ts
const pagination = getPaginationFromQuery(c); // derived from validated query
```

## 12. Module Generator
Generate a complete module with all files using Plop.js.

### Commands
```sh
# Interactive mode (select files to generate)
bun run generate

# Non-interactive mode (generates all files)
bun run generate:module:all <name>

# Examples
bun run generate:module:all user
bun run generate:module:all productCategory
```

### Generated Structure
For `bun run generate:module:all user`, creates:
```
src/modules/user/
├── user.controller.ts   # getUserList handler
├── user.route.ts        # GET / endpoint (auto-registered)
├── user.schema.ts       # Drizzle table (auto-exported)
├── user.service.ts     # getAll method
├── user.validator.ts    # createUserValidator + zCreateUserValidator
└── index.ts             # Barrel exports
```

### After Generation
Routes and schemas are auto-registered! Just generate migration:
```sh
bun db:generate --name=create-user-table
bun db:migrate
```

## 12b. Manual Module Creation (Alternative)
If you prefer to create modules manually, see the pattern in `src/modules/projects/`.

## 13. Logging
`logMiddleware` logs each request: timestamp, IP, method, path, status, duration, user agent, referer. Replace or extend with structured logging (e.g., pino) as needed.

## 14. Roadmap / Next Steps
- Add authentication/authorization layers (middleware + JWT helpers).
- Introduce OpenAPI spec generation.
- Add integration tests (e.g., using Bun test runner).
- Containerize Postgres + service with `docker-compose.yml`.
- Add caching (Redis) or rate limiting.

## 15. Contributing
Follow these guidelines to keep the codebase consistent and maintainable.

Core Principles:
- Keep modules isolated: a module folder must encapsulate schema, service, controller, validators, and routes.
- Favor pure functions in services (no direct `Context` usage).
- Reuse shared helpers (`utils/helpers`) instead of duplicating logic.

Development Workflow:
1. Fork or create a feature branch from `main` (e.g. `feature/tasks-module`).
2. Run `bun install` then `bun biome:check` to ensure formatting & linting passes.
3. Add/modify module files under `src/modules/<name>/`.
4. Export new schemas via `src/schemas/index.ts` before generating migrations.
5. Generate & apply migrations:
	```sh
	bun db:generate --name=<short-migration-name>
	bun db:migrate
	```
6. Update README if you introduce new conventions or environment variables.
7. Run any test scripts (add a Bun test setup if needed in `__tests__/`).
8. Open a Pull Request with a clear summary and checklist.

Commit Message Convention:
- Use concise present tense: `add tasks module pagination`, `fix conflict error mapping`.
- Prefix optional scopes: `feat(tasks): add create endpoint` / `fix(db): handle unique violation`.

Branch Naming:
- `feat/<module>-<short-desc>` for new features.
- `fix/<issue-ref>` for bug fixes.
- `chore/<task>` for maintenance (deps, formatting).

Code Style:
- Run `bun biome:check` before committing.
- Avoid large, multi-purpose commits; keep changes focused.
- Prefer explicit function and variable names; avoid one-letter identifiers.

Error Handling:
- Throw specific custom errors (`ConflictError`, `NotFoundError`, etc.) rather than generic `Error` for predictable responses.
- Validation errors must use the `validationMiddleware` pattern to ensure consistent JSON structure.

Migrations:
- Never edit existing migration SQL after it has been committed; create a new one instead.
- Use descriptive names (`add-tasks-table`, `add-index-projects-name`).

Security & Secrets:
- Do not commit `.env`; update `.env.example` when adding required variables.
- Sanitize logs (avoid dumping credentials) — current logger is simple; extend when needed.

Pull Request Template (suggested):
```
## Summary
Short description of the change.

## Changes
- List key modifications.

## New Migrations
- <file-name.sql>

## Validation
- [ ] biome:check passes
- [ ] migrations applied locally
- [ ] endpoints manually tested

## Screenshots / Logs (optional)

## Follow-up
Any next steps or related TODOs.
```

Need Help?
- Open an issue describing the problem or enhancement with context and expected outcome.

## Quick Reference
```sh
# Install deps
bun install
# Run dev server
bun dev
# Format & lint
bun biome:check
# Generate & apply migrations
bun db:generate
bun db:migrate
# Generate new module
bun run generate:module:all <name>
```

---
Feel free to tailor sections further to project-specific needs.
