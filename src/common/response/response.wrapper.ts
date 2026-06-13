import { applyDecorators, type Type } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export function createResponseSchema<T extends z.ZodTypeAny>(
  resultSchema: T,
): z.ZodObject<
  {
    ok: z.ZodDefault<z.ZodBoolean>;
    result: T;
  },
  z.core.$strip
> {
  return z.object({
    ok: z.boolean().default(true),
    result: resultSchema,
  });
}

export function ApiOkResponseWrapped<
  T extends Type<unknown> | (new (...args: unknown[]) => unknown),
>(model: T, options: { status?: number } = { status: 200 }): MethodDecorator & ClassDecorator {
  const modelSchema =
    model && typeof model === 'function' && 'schema' in model
      ? (model as unknown as { schema: z.ZodTypeAny }).schema
      : z.any();

  const wrappedZodSchema = createResponseSchema(modelSchema);
  class WrappedDto extends createZodDto(wrappedZodSchema) {}

  const modelName = typeof model === 'function' ? model.name : 'Data';

  Object.defineProperty(WrappedDto, 'name', {
    value: `Wrapped${modelName}`,
  });

  return applyDecorators(
    ApiResponse({
      status: options.status,
      type: WrappedDto,
    }),
  );
}
