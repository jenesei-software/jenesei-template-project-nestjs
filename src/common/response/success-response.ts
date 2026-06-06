import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const SuccessResponseSchema = z.object({
  message: z.string().default('success'),
});

export const ObjectResponseSchema = z.object({});

export class SuccessResponseDto extends createZodDto(SuccessResponseSchema) {}
export class ObjectResponseDto extends createZodDto(ObjectResponseSchema) {}
