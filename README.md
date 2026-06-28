# 🚀 NestJS Production Template

> Production-ready NestJS starter with **Hexagonal Architecture**, Fastify, Swagger, Docker, CLI-bus, unified response format, and TypeScript best practices baked in.

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
- [HTTP Response Format](#http-response-format)
- [Error Handling](#error-handling)
- [Swagger API Docs](#swagger-api-docs)
- [Docker](#docker)
- [Adding a New Module](#adding-a-new-module)
- [Naming Conventions](#naming-conventions)
- [Code Style & Linting](#code-style--linting)

---

## Overview

This template is a production-ready starting point for building scalable NestJS services. It enforces a clean **Hexagonal (Ports & Adapters)** architecture, separates concerns at every layer, and ships with all the boilerplate you'd otherwise spend days wiring up:

- HTTP server via **Fastify** (faster than Express out of the box)
- Interactive **Swagger UI** with a custom theme
- **CLI bus** — run commands against a running service via HTTP, no extra transport needed
- **Unified response format** — all HTTP responses share the same `{ ok, message, result? }` envelope
- **Domain exceptions** — throw business errors from domain layer without knowing about HTTP
- **Docker** — separate optimised images for dev and prod
- **Zod** schemas for runtime validation and automatic Swagger schema generation via `nestjs-zod`
- Environment-aware config with `.env.development` / `.env.production`
- **Biome** for linting and formatting — single tool instead of ESLint + Prettier

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | NestJS 11 |
| HTTP Adapter | Fastify |
| Validation | nestjs-zod + Zod |
| API Docs | @nestjs/swagger + swagger-themes |
| Config | @nestjs/config + dotenv |
| Language | TypeScript 5 |
| Linting | Biome 2 |
| Container | Docker (Alpine, multi-stage) |

---

## Project Structure

```
src/
├── main.ts                        # HTTP entrypoint
├── cli.ts                         # CLI entrypoint (calls running service via HTTP)
│
├── app/
│   ├── app.module.ts              # Root module
│   ├── env/                       # Env variable schemas (Zod) — fail-fast validation
│   └── setup/                     # App bootstrap: CORS, HTTPS, Logger, Swagger
│
├── common/
│   ├── contracts/                 # Global infrastructure interfaces (ICacheService, IMessageBroker)
│   ├── decorators/                # Shared decorators (response wrapper, CLI command)
│   ├── dto/                       # Shared DTOs (success/error response shapes)
│   ├── exceptions/                # Domain exceptions (DomainException and built-in subtypes)
│   ├── filters/                   # Global HTTP exception filter + exception-status map
│   ├── guards/                    # Shared guards (e.g. LocalOnlyGuard)
│   ├── interceptors/              # Global interceptors (response wrapper)
│   └── utils/                     # Shared utilities (env helpers, etc.)
│
├── infra/
│   ├── cache/                     # ICacheService implementations (e.g. Redis)
│   ├── db/                        # Database providers (e.g. Prisma, TypeORM)
│   ├── http/                      # External HTTP clients
│   ├── messaging/                 # IMessageBroker implementations (e.g. Kafka, RabbitMQ)
│   └── mock/                      # In-memory mock repository (for dev/testing)
│
└── modules/
    ├── cli/                       # CLI command registry & HTTP adapter
    └── dummy/                     # Example module — copy to create your own
        ├── adapters/
        │   ├── in/
        │   │   ├── http/          # HTTP controller + routes
        │   │   └── cli/           # CLI adapter + command names
        │   └── out/               # Repository implementation
        ├── domain/                # Business logic (service)
        ├── ports/
        │   ├── in/                # Use-case interfaces
        │   └── out/               # Output port interfaces (IRepository, etc.)
        ├── dummy.di.ts            # DI injection tokens
        └── dummy.module.ts        # Module definition
```

---

## Architecture

The project follows **Hexagonal Architecture** (Ports & Adapters). Business logic stays completely independent of frameworks, databases, and transport mechanisms.

```
┌─────────────────────────────────────────────┐
│                 Adapters IN                  │
│       (HTTP Controller, CLI Adapter)         │
└────────────────────┬────────────────────────┘
                     │ calls
              ┌──────▼──────┐
              │  Port (in)  │  ← use-case interface
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
│                 Adapters OUT                 │
│        (Repository, external API, etc.)      │
└─────────────────────────────────────────────┘
```

### Key Principles

**Domain** (`domain/`) knows nothing about HTTP, databases, or NestJS. It depends only on port interfaces injected via tokens.

**Ports IN** (`ports/in/`) define what the domain exposes — use-case interfaces that controllers and CLI adapters call.

**Ports OUT** (`ports/out/`) define what the domain needs from the outside world — repository interfaces, email senders, cache, etc.

**Adapters IN** (`adapters/in/`) are NestJS controllers and CLI handlers. They translate HTTP/CLI input into domain calls.

**Adapters OUT** (`adapters/out/`) are concrete implementations: real DB repositories, third-party clients, mocks.

**`common/`** holds infrastructure contracts and utilities that are not tied to any business module — shared guards, interceptors, filters, DTOs, and global interfaces (`ICacheService`, `IMessageBroker`).

**`infra/`** holds concrete implementations of those global contracts — wired into the app via `InfrastructureModules`.

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
| `CLI_SERVICE_URL` | Base URL the CLI binary calls | `http://localhost` |
| `LOG_LEVEL` | Logger verbosity | `debug` |

All variables are validated at startup via Zod schemas in `app/env/`. The app will **fail fast** if a required variable is missing or has the wrong type.

---

## Running the App

```bash
# Development (watch mode)
npm run start:dev

# Debug mode with watch
npm run start:debug

# Production build + run
npm run build
npm run start:prod

# Run a CLI command against a running dev instance
npm run start:cli -- <command> [options]
```

The server starts on `http://localhost:PORT`. Swagger UI is available at `http://localhost:PORT/docs`.

---

## CLI Interface

The CLI is a thin client binary that sends commands to a **running** service instance over HTTP. This avoids duplicating the full NestJS bootstrap in a separate process.

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

### Adding a CLI Command

1. Create an adapter in your module's `adapters/in/cli/` and implement `ICliCommand`:

```typescript
// modules/your-feature/adapters/in/cli/your-feature-cli.adapter.ts
import { Injectable } from '@nestjs/common';
import { CliCommand } from '@/common';
import { ICliCommand } from '@/modules/cli/ports';

@CliCommand({ name: 'your-feature:greet', description: 'Says hello' })
@Injectable()
export class YourFeatureCliAdapter implements ICliCommand {
  async execute(payload: Record<string, unknown>): Promise<unknown> {
    return { message: `Hello, ${payload['--name']}!` };
  }
}
```

2. Register it in your module's `providers`. The CLI registry discovers all `@CliCommand`-decorated providers automatically.

### Security

The `/cli/execute` endpoint is protected by `LocalOnlyGuard` — only requests from `127.0.0.1` / `::1` are accepted. Do not expose this port publicly.

---

## HTTP Response Format

All HTTP responses share a unified envelope format handled automatically by `ResponseWrapperInterceptor`.

### Success

```json
{ "ok": true, "message": "success" }
```

```json
{ "ok": true, "message": "success", "result": { "id": 1, "name": "foo" } }
```

Controllers return plain data — the interceptor wraps it automatically. If the controller returns `void` / `undefined`, `result` is omitted.

### Error

```json
{
  "ok": false,
  "message": "Dummy not found",
  "code": "NOT_FOUND"
}
```

```json
{
  "ok": false,
  "message": "Validation error",
  "code": "BAD_REQUEST",
  "errors": ["name must be a string", "email must be a valid email"]
}
```

### Documenting responses in Swagger

Use the provided decorators instead of raw `@ApiResponse`:

```typescript
import { ApiOkResponseWrapped, ApiErrorResponse } from '@/common';

// GET — returns a result object
@ApiOkResponseWrapped(DummyDto)
@Get(':id')
async getOne(@Param('id') id: string): Promise<DummyDto> { ... }

// POST — returns no body, 201
@ApiOkResponseWrapped({ status: 201 })
@Post()
async create(@Body() dto: CreateDummyDto): Promise<void> { ... }

// DELETE — 204 No Content
@ApiOkResponseWrapped({ status: 204 })
@HttpCode(204)
@Delete(':id')
async remove(@Param('id') id: string): Promise<void> { ... }

// Document possible errors (can stack multiple)
@ApiErrorResponse(404, [{ code: 'NOT_FOUND', description: 'Dummy not found' }])
@ApiErrorResponse(409, [{ code: 'DUMMY_LOCKED', description: 'Dummy is locked' }])
```

---

## Error Handling

### Domain Exceptions

Throw business errors from the domain layer without knowing about HTTP. The exception filter maps them to the correct HTTP status automatically.

```typescript
import { DomainException, NotFoundException, ConflictException } from '@/common';

// Built-in subtypes
throw new NotFoundException('User #42 not found');       // → 404 NOT_FOUND
throw new ConflictException('Email already taken');      // → 409 CONFLICT

// Custom code
throw new DomainException('User is busy', 'USER_BUSY'); // → 400 by default

// With errors array (e.g. validation)
throw new DomainException('Validation failed', 'VALIDATION_ERROR', [
  'name is required',
  'email must be valid',
]);

// With meta — structured dynamic data for the frontend
throw new DomainException(
  'User #81 is waiting for user #10',
  'USER_WAITING',
  undefined,
  { waiterId: 81, targetId: 10 },
);
```

The `message` field is human-readable and can contain dynamic values. The `code` field is a stable machine-readable key — never put dynamic content in it. The `meta` field carries structured dynamic data that the frontend can use without parsing strings (e.g. for i18n, highlighting specific entities in the UI).

Error response shape:

```json
{
  "ok": false,
  "message": "User #81 is waiting for user #10",
  "code": "USER_WAITING",
  "meta": { "waiterId": 81, "targetId": 10 }
}
```

### Registering Custom Error Codes

To map a custom code to a specific HTTP status, call `registerExceptionStatus` before or during module setup:

```typescript
// modules/your-feature/your-feature.module.ts
import { registerExceptionStatus } from '@/common';

registerExceptionStatus('USER_BUSY', 409);
registerExceptionStatus('FEATURE_DISABLED', 503);

@Module({ ... })
export class YourFeatureModule {}
```

### Built-in Mappings

| Code | HTTP Status |
|---|---|
| `NOT_FOUND` | 404 |
| `FORBIDDEN` | 403 |
| `UNAUTHORIZED` | 401 |
| `CONFLICT` | 409 |
| `VALIDATION_ERROR` | 400 |
| _(any unknown code)_ | 400 |

### Documenting Errors in Swagger

Use `ApiErrorResponse` to document possible error responses per endpoint. All fields except `code` and `description` are optional:

```typescript
// Simple error
@ApiErrorResponse(404, [
  { code: 'NOT_FOUND', description: 'User not found' },
])

// Multiple errors on the same status
@ApiErrorResponse(409, [
  { code: 'USER_BUSY', description: 'User is currently busy' },
  { code: 'CONFLICT', description: 'Resource already exists' },
])

// Validation error with errors array
@ApiErrorResponse(400, [
  {
    code: 'VALIDATION_ERROR',
    description: 'Validation failed',
    errors: ['name is required', 'email must be valid'],
  },
])

// Error with meta — shows dynamic payload shape in Swagger
@ApiErrorResponse(409, [
  {
    code: 'USER_WAITING',
    description: 'User is waiting for another user',
    meta: { waiterId: 81, targetId: 10 },
  },
])
```

---

## Swagger API Docs

Swagger is configured in `app/setup/swagger/` and is available in development at:

- UI: `http://localhost:PORT/docs`
- JSON spec: `http://localhost:PORT/docs-json`

DTOs are defined using `nestjs-zod` — use `createZodDto` to get automatic Swagger schema generation:

```typescript
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const CreateDummySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export class CreateDummyDto extends createZodDto(CreateDummySchema) {}
```

---

## Docker

### Development

```bash
docker build -f deployments/docker/Dockerfile_dev -t nest-app:dev .
docker run -p 3000:3000 --env-file .env.development nest-app:dev
```

### Production

The production Dockerfile is a **two-stage** build:

1. **Builder** — installs all deps, compiles TypeScript
2. **Runner** — copies only `dist/`, production `node_modules`, and `resources/`

```bash
docker build -f deployments/docker/Dockerfile_prod -t nest-app:prod .
docker run -p 3000:3000 --env-file .env.production nest-app:prod
```

### docker-compose (recommended for dev)

```yaml
services:
  app:
    build:
      context: .
      dockerfile: deployments/docker/Dockerfile_dev
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
    ├── your-feature.di.ts             # DI injection tokens
    ├── index.ts
    ├── adapters/
    │   ├── in/
    │   │   ├── http/
    │   │   │   ├── your-feature-http.adapter.ts   # controller
    │   │   │   └── your-feature-http.routes.ts    # route constants
    │   │   └── cli/
    │   │       ├── your-feature-cli.adapter.ts    # CLI handler (optional)
    │   │       └── your-feature-cli.commands.ts   # command name constants
    │   └── out/
    │       └── your-feature.repository.ts         # DB / external service
    ├── domain/
    │   └── your-feature.service.ts                # business logic
    └── ports/
        ├── in/
        │   └── your-feature.use-case.ts           # use-case interface
        └── out/
            └── your-feature.port.ts               # repository interface
```

### 1. Define the DI tokens

```typescript
// your-feature.di.ts
export const YOUR_FEATURE_DI = {
  REPOSITORY: 'YOUR_FEATURE_DI_REPOSITORY',
} as const;
```

### 2. Define the output port

```typescript
// ports/out/your-feature.port.ts
export interface IYourFeatureRepository {
  findById(id: string): Promise<YourFeature | null>;
  save(entity: YourFeature): Promise<void>;
}
```

### 3. Define the use-case interface

```typescript
// ports/in/your-feature.use-case.ts
export interface IYourFeatureUseCase {
  getOne(id: string): Promise<YourFeature>;
}
```

### 4. Implement the domain service

```typescript
// domain/your-feature.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@/common';
import { YOUR_FEATURE_DI } from '../your-feature.di';
import { IYourFeatureRepository } from '../ports/out/your-feature.port';
import { IYourFeatureUseCase } from '../ports/in/your-feature.use-case';

@Injectable()
export class YourFeatureService implements IYourFeatureUseCase {
  constructor(
    @Inject(YOUR_FEATURE_DI.REPOSITORY)
    private readonly repository: IYourFeatureRepository,
  ) {}

  async getOne(id: string): Promise<YourFeature> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException(`YourFeature ${id} not found`);
    return entity;
  }
}
```

### 5. Wire up the module

```typescript
// your-feature.module.ts
import { Module } from '@nestjs/common';
import { YOUR_FEATURE_DI } from './your-feature.di';
import { YourFeatureService } from './domain/your-feature.service';
import { YourFeatureRepository } from './adapters/out/your-feature.repository';
import { YourFeatureHttpAdapter } from './adapters/in/http/your-feature-http.adapter';

@Module({
  controllers: [YourFeatureHttpAdapter],
  providers: [
    YourFeatureService,
    { provide: YOUR_FEATURE_DI.REPOSITORY, useClass: YourFeatureRepository },
  ],
})
export class YourFeatureModule {}
```

### 6. Register in the app

```typescript
// modules/index.ts
export const DomainModules = [CliModule, DummyModule, YourFeatureModule];
```

---

## Naming Conventions

Consistent naming makes the codebase navigable without prior context. All names follow the pattern `{module}-{transport}.{role}.ts`.

### Files

| Role | Pattern | Example |
|---|---|---|
| HTTP controller | `{module}-http.adapter.ts` | `dummy-http.adapter.ts` |
| CLI handler | `{module}-cli.adapter.ts` | `dummy-cli.adapter.ts` |
| Repository (out adapter) | `{module}.repository.ts` | `dummy.repository.ts` |
| Domain service | `{module}.service.ts` | `dummy.service.ts` |
| Use-case interface | `{module}.use-case.ts` | `dummy.use-case.ts` |
| Output port interface | `{module}.port.ts` | `dummy.port.ts` |
| DI tokens | `{module}.di.ts` | `dummy.di.ts` |
| HTTP route constants | `{module}-http.routes.ts` | `dummy-http.routes.ts` |
| CLI command constants | `{module}-cli.commands.ts` | `dummy-cli.commands.ts` |
| NestJS module | `{module}.module.ts` | `dummy.module.ts` |
| Global contract/interface | `{subject}.contract.ts` | `cache.contract.ts` |
| Guard | `{purpose}.guard.ts` | `local-only.guard.ts` |
| Interceptor | `{purpose}.interceptor.ts` | `response-wrapper.interceptor.ts` |
| Filter | `{purpose}.filter.ts` | `http-exception.filter.ts` |
| Decorator | `{purpose}.decorator.ts` | `cli-command.decorator.ts` |
| DTO + Zod schema | `{subject}.ts` inside `dto/` | `cmd-execute.dto.ts` |
| Barrel export | `index.ts` | `index.ts` |

### Classes & Interfaces

| Kind | Convention | Example |
|---|---|---|
| NestJS module | `PascalCase` + `Module` suffix | `DummyModule` |
| HTTP controller | `PascalCase` + `HttpAdapter` suffix | `DummyHttpAdapter` |
| CLI handler | `PascalCase` + `CliAdapter` suffix | `DummyCliAdapter` |
| Domain service | `PascalCase` + `Service` suffix | `DummyService` |
| Repository | `PascalCase` + `Repository` suffix | `DummyRepository` |
| Interface | `I` prefix + `PascalCase` | `IDummyRepository`, `ICacheService` |
| DTO class | `PascalCase` + `Dto` suffix | `CreateDummyDto` |
| Zod schema const | `PascalCase` + `Schema` suffix | `CreateDummySchema` |
| Exception | `PascalCase` + `Exception` suffix | `DomainException` |

### Constants & Tokens

| Kind | Convention | Example |
|---|---|---|
| DI token object | `SCREAMING_SNAKE_CASE` + `_DI` | `DUMMY_DI` |
| Token value (string) | `SCREAMING_SNAKE_CASE` | `'DUMMY_DI_REPOSITORY'` |
| Route constants object | `SCREAMING_SNAKE_CASE` + `_ROUTES` | `DUMMY_HTTP_ROUTES` |
| CLI command names object | `SCREAMING_SNAKE_CASE` + `_COMMANDS` | `DUMMY_CLI_COMMANDS` |
| CLI command name (string) | `{module}:{action}` | `'dummy:execute'` |
| Exception status map key | `SCREAMING_SNAKE_CASE` | `'USER_ALREADY_BUSY'` |
| Metadata key | `SCREAMING_SNAKE_CASE` | `'RESPONSE_STATUS'` |

### Where Each File Lives

The location of a file must match its role — if a file is only used by one adapter, it lives next to that adapter, not in `ports/`.

```
ports/in/        ← interfaces and use-case contracts only
ports/out/       ← output port interfaces only
adapters/in/http/  ← HTTP controller, route constants, DTOs, guards specific to HTTP
adapters/in/cli/   ← CLI adapter, command name constants
adapters/out/      ← repository / external service implementation
domain/            ← service, domain entities, value objects
{module}.di.ts     ← DI tokens (lives next to the module file)
{module}.module.ts ← module wiring
common/contracts/  ← interfaces used across multiple modules (ICacheService, IMessageBroker)
common/guards/     ← guards used by more than one module
infra/             ← concrete implementations of common contracts
```

---

## Code Style & Linting

The project uses **Biome** for both linting and formatting (configured in `biome.json`).

```bash
# Lint and auto-fix
npm run lint

# Format
npm run format

# Lint + format together
npm run check

# Check with unsafe fixes (use with caution)
npm run check:unsafe
```

Path alias `@/*` maps to `./src/*` in TypeScript (`tsconfig.json`).

---

## License
