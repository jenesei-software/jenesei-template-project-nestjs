import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ErrorResponseSchema = z.object({
  ok: z.boolean().default(false),
  message: z.string(),
  code: z.string(),
  errors: z.array(z.string()).optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

export class ErrorResponseDto extends createZodDto(ErrorResponseSchema) {}
