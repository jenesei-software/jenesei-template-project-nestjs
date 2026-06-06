# 🚀 NestJS Production Template

> Production-ready NestJS starter with **Hexagonal Architecture**, Fastify, Swagger, Docker, CLI-bus, and TypeScript best practices baked in.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Running the App](#running-the-app)
- [CLI Interface](#cli-interface)
- [Docker](#docker)
- [Adding a New Module](#adding-a-new-module)
- [Swagger API Docs](#swagger-api-docs)
- [Code Style & Linting](#code-style--linting)

---

## Overview

This template is a battle-hardened starting point for building scalable NestJS services. It enforces a clean **Hexagonal (Ports & Adapters)** architecture, separates concerns at every layer, and ships with all the boilerplate you'd otherwise spend days wiring up:

- HTTP server via **Fastify** (faster than Express out of the box)
- Interactive **Swagger UI** with a custom theme
- **CLI bus** — run commands against a running service via HTTP, no extra transport needed
- **Docker** — separate optimised images for dev and prod
- **Zod** schemas for runtime validation via `nestjs-zod`
- Environment-aware config with `.env.development` / `.env.production`
- ESLint + Prettier pre-configured

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | NestJS 11 |
| HTTP Adapter | Fastify |
| Validation | nestjs-zod + Zod |
| API Docs | @nestjs/swagger + swagger-themes |
| CLI Runner | nest-commander (+ HTTP bus) |
| Config | @nestjs/config + dotenv |
| Language | TypeScript 5 |
| Linting | ESLint 9 + typescript-eslint + prettier |
| Container | Docker (Alpine, multi-stage) |

---

## Project Structure

```
src/
├── main.ts                  # HTTP entrypoint
├── cli.ts                   # CLI entrypoint (calls running service via HTTP)
│
├── app/
│   ├── app.module.ts        # Root module
│   ├── env/                 # Env variable schemas (Zod)
│   └── setup/              # App bootstrap: CORS, HTTPS, Logger, Swagger
│
├── common/
│   ├── response/            # Unified response wrappers
│   └── utils/               # Shared utilities (env helpers, etc.)
│
├── infra/
│   └── mock/                # In-memory mock repository (for dev/testing)
│
└── modules/
    ├── cli/                 # CLI command registry & HTTP adapter
    └── dummy/               # Example module — copy to create your own
        ├── adapters/
        │   ├── in/          # HTTP controller, CLI adapter
        │   └── out/         # Repository implementation
        ├── domain/          # Business logic (service)
        └── ports/
            ├── in/          # Use-case interfaces + contracts
            └── out/         # Output port interface
```

---

## Architecture

The project follows **Hexagonal Architecture** (also known as Ports & Adapters). The goal is to keep business logic completely independent of frameworks, databases, and transport mechanisms.

```
┌─────────────────────────────────────────────┐
│                   Adapters IN                │
│         (HTTP Controller, CLI Adapter)       │
└────────────────────┬────────────────────────┘
                     │ calls
              ┌──────▼──────┐
              │  Port (in)  │  ← interface / use-case contract
              └──────┬──────┘
                     │ implements
          ┌──────────▼──────────┐
          │   Domain Service    │  ← pure business logic, no NestJS deps
          └──────────┬──────────┘
                     │ calls
              ┌──────▼──────┐
              │  Port (out) │  ← output port interface (e.g. IRepository)
              └──────┬──────┘
                     │ implements
┌────────────────────▼────────────────────────┐
│                  Adapters OUT                │
│          (Repository, external API, etc.)    │
└─────────────────────────────────────────────┘
```

### Key Principles

**Domain** (`domain/`) knows nothing about HTTP, databases, or NestJS. It depends only on port interfaces injected via tokens.

**Ports IN** (`ports/in/`) define what the domain exposes — use-case interfaces that controllers/CLI call.

**Ports OUT** (`ports/out/`) define what the domain needs from the outside world — repository interfaces, email senders, etc.

**Adapters IN** (`adapters/in/`) are NestJS controllers and CLI handlers. They translate HTTP/CLI input into domain calls.

**Adapters OUT** (`adapters/out/`) are concrete implementations: real DB repositories, third-party clients, mocks.

---

## Getting Started

### Prerequisites

- Node.js ≥ 22
- npm ≥ 10

### Install

```bash
git clone <your-repo-url>
cd nest-template
npm install
```

---

## Environment Configuration

The app uses two env files at the project root:

```
.env.development    # used when NODE_ENV=development
.env.production     # used when NODE_ENV=production
```

Copy the example and fill in your values:

```bash
cp .env.development.example .env.development
```

### Common Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | HTTP port | `3000` |
| `CONTEXT_API` | Global route prefix (e.g. `api/v1`) | — |
| `CLI_SERVICE_URL` | Base URL the CLI binary calls | `http://localhost:3000` |
| `LOG_LEVEL` | Logger verbosity | `debug` |

All variables are validated at startup via Zod schemas in `app/env/`. The app will **fail fast** if a required variable is missing or has the wrong type.

---

## Running the App

```bash
# Development (watch mode, .env.development)
npm run start:dev

# Debug mode with watch
npm run start:debug

# Production build + run
npm run build
npm run start:prod
```

The server will start on `http://localhost:PORT`. Swagger UI is available at `http://localhost:PORT/docs` (development only by default).

---

## CLI Interface

The CLI is a thin client binary that sends commands to a **running** service instance over HTTP. This keeps the CLI stateless and avoids duplicating app bootstrap in a separate process.

### Usage

```bash
# Via npm script (development)
npm run start:cli -- <command> [options]

# Via installed binary (after npm link or global install)
app <command> [options]
```

### Argument Syntax

| Syntax | Result |
|---|---|
| `app cmd --flag` | `{ "--flag": true }` |
| `app cmd --key value` | `{ "--key": "value" }` |
| `app cmd --key=value` | `{ "--key": "value" }` |

### Example

```bash
# Call the dummy:hello command
app dummy:hello --name World
```

### Adding a CLI Command

1. Create a class in `adapters/in/` of your module, decorate it with `@CliCommand`:

```typescript
import { CliCommand } from '@/modules/cli/ports/in/cli-command.decorator';
import { ICliCommand } from '@/modules/cli/ports/in/cli-command.interface';

@CliCommand({ name: 'my-module:greet', description: 'Says hello' })
export class MyCliAdapter implements ICliCommand {
  async execute(payload: Record<string, unknown>): Promise<unknown> {
    return { message: `Hello, ${payload['--name']}!` };
  }
}
```

2. Register it in your module providers. The CLI registry discovers all `@CliCommand`-decorated providers automatically via metadata.

---

## Docker

### Development

```bash
docker build -f Dockerfile.dev -t nest-app:dev .
docker run -p 3000:3000 --env-file .env.development nest-app:dev
```

### Production

The production Dockerfile is a **two-stage** build:

1. **Builder** — installs all deps, compiles TypeScript, prunes `devDependencies`
2. **Production** — copies only the compiled `dist/`, production `node_modules`, and `resources/`

```bash
docker build -t nest-app:prod .
docker run -p 3000:3000 --env-file .env.production nest-app:prod
```

Default container port is `3000`. Override with `-e PORT=8080`.

### docker-compose (recommended for dev)

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    env_file:
      - .env.development
```

---

## Adding a New Module

The `dummy` module is a fully wired example — the intended workflow is to copy it and rename everything.

### Step-by-step

```
modules/
└── your-feature/
    ├── your-feature.module.ts
    ├── index.ts
    ├── adapters/
    │   ├── in/
    │   │   ├── your-feature-http.adapter.ts   ← controller
    │   │   └── your-feature-cli.adapter.ts    ← CLI handler (optional)
    │   └── out/
    │       └── your-feature.repository.ts     ← DB / external service
    ├── domain/
    │   └── your-feature.service.ts            ← business logic
    └── ports/
        ├── your-feature.token.ts              ← DI injection tokens
        ├── in/
        │   ├── your-feature.use-case.ts       ← use-case interface
        │   ├── your-feature-http.contract.ts  ← Zod DTOs for HTTP
        │   └── your-feature-cli.contract.ts   ← Zod DTOs for CLI
        └── out/
            └── your-feature.port.ts           ← repository interface
```

After creating the module, register it in `app/app.module.ts`:

```typescript
import { YourFeatureModule } from '@/modules/your-feature';

@Module({
  imports: [YourFeatureModule],
})
export class AppModule {}
```

### DI Pattern

Bind the output port in your module using the token:

```typescript
// your-feature.module.ts
{
  provide: YOUR_FEATURE_REPOSITORY_TOKEN,
  useClass: YourFeatureRepository,
}
```

Inject it in the service:

```typescript
constructor(
  @Inject(YOUR_FEATURE_REPOSITORY_TOKEN)
  private readonly repo: IYourFeaturePort,
) {}
```

---

## Swagger API Docs

Swagger is configured in `app/setup/swagger/`. It is enabled by default in development and can be toggled via env.

- UI available at: `http://localhost:PORT/docs`
- JSON spec at: `http://localhost:PORT/docs-json`

DTOs are defined using `nestjs-zod` — use `createZodDto` to get automatic Swagger schema generation from your Zod schemas:

```typescript
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
```

---

## Code Style & Linting

```bash
# Lint and auto-fix
npm run lint

# Format with Prettier
npm run format
```

ESLint is configured via `eslint.config.js` using the flat config format (ESLint 9). Key rules enforced:

- `import-x` plugin for import ordering and no-missing checks
- TypeScript strict rules via `typescript-eslint`
- Prettier integration as an ESLint rule (no separate prettier step needed in CI)

Path alias `@/*` maps to `./src/*` in both TypeScript and ESLint.

---

## License

UNLICENSED — private use only.
