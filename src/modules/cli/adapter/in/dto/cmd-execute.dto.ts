import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const ExecuteCommandSchema = z.object({
  command: z
    .string({
      error: 'Имя команды обязательно',
    })
    .min(1)
    .describe('Команда выполнения')
    .meta({ example: 'dummy:execute' }),
  payload: z.record(z.string(), z.any()).default({}).describe('Параметры').meta({
    example: '-f',
  }),
});

export class ExecuteCommandDto extends createZodDto(ExecuteCommandSchema) {}
