import { applyDecorators, SetMetadata, type Type } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ErrorResponseDto } from '../dto';

export const RESPONSE_STATUS = 'RESPONSE_STATUS';

export function createResponseSchema<T extends z.ZodTypeAny>(resultSchema?: T) {
  const base = {
    ok: z.boolean().default(true),
    message: z.string().default('success'),
  };

  if (!resultSchema) return z.object(base);

  return z.object({ ...base, result: resultSchema });
}

export function ApiOkResponseWrapped(options?: {
  status?: number;
}): MethodDecorator & ClassDecorator;
export function ApiOkResponseWrapped<T extends Type<unknown>>(
  model: T,
  options?: { status?: number },
): MethodDecorator & ClassDecorator;
export function ApiOkResponseWrapped<T extends Type<unknown>>(
  modelOrOptions?: T | { status?: number },
  options: { status?: number } = { status: 200 },
): MethodDecorator & ClassDecorator {
  const isOptions =
    modelOrOptions && typeof modelOrOptions === 'object' && !('schema' in modelOrOptions);

  const model = isOptions ? undefined : (modelOrOptions as T | undefined);
  const resolvedOptions = isOptions ? (modelOrOptions as { status?: number }) : options;
  const status = resolvedOptions.status ?? 200;

  const modelSchema =
    model && typeof model === 'function' && 'schema' in model
      ? (model as unknown as { schema: z.ZodTypeAny }).schema
      : undefined;

  const wrappedZodSchema = createResponseSchema(modelSchema);
  class WrappedDto extends createZodDto(wrappedZodSchema) {}
  const modelName = model ? model.name : 'Empty';
  Object.defineProperty(WrappedDto, 'name', { value: `Wrapped${modelName}` });

  return applyDecorators(
    SetMetadata(RESPONSE_STATUS, status),
    ApiResponse({ status, ...(status !== 204 ? { type: WrappedDto } : {}) }),
  );
}

export function ApiErrorResponse(
  status: number,
  errors: Array<{
    code: string;
    description: string;
    errors?: string[];
    meta?: Record<string, unknown>;
  }>,
): MethodDecorator & ClassDecorator {
  const examples = Object.fromEntries(
    errors.map(({ code, description, errors: fieldErrors, meta }) => [
      code,
      {
        summary: description,
        value: {
          ok: false,
          message: description,
          code,
          ...(fieldErrors ? { errors: fieldErrors } : {}),
          ...(meta ? { meta } : {}),
        },
      },
    ]),
  );

  return applyDecorators(ApiResponse({ status, type: ErrorResponseDto, examples }));
}
