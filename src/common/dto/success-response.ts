import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const SuccessResponseSchema = z.object({
  message: z.string().default('success'),
});

export const ObjectSchema = z.object({});
export class ObjectResponseDto extends createZodDto(ObjectSchema) {}
export class SuccessResponseDto extends createZodDto(SuccessResponseSchema) {}
