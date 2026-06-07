#!/usr/bin/env node

import { join } from 'path';
import { loadEnvFile } from 'process';

async function bootstrap() {
  // process.argv[0] — это путь к node
  // process.argv[1] — это путь к скрипту (cli.js)
  // process.argv[2] — это имя команды (COMMAND)
  const [, , commandName, ...rawParams] = process.argv;

  if (!commandName) {
    console.error('\x1b[31mОшибка: Не указано имя команды.\x1b[0m');
    console.log('Использование: app COMMAND [PARAMS]');
    process.exit(1);
  }
  setEnv();
  // Парсим оставшиеся аргументы (PARAMS) в плоский объект payload
  const payload = parseArgsToPayload(rawParams);

  // Конфигурация (можно переопределить через переменные окружения)
  const baseUrl = process.env.CLI_SERVICE_URL || 'http://localhost';
  const port = process.env.PORT || '3000';
  const prefix = process.env.CONTEXT_API || '';

  const cleanPrefix = prefix ? `${prefix}/` : '';
  const targetUrl = `${baseUrl}:${port}/${cleanPrefix}cli/execute`;

  const dto = {
    command: commandName,
    payload: payload,
  };

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`\x1b[31mОшибка сервера (Статус ${response.status}):\x1b[0m`, errorText);
      process.exit(1);
    }

    const result = await response.json();
    console.log('\x1b[32mУспешно выполнено:\x1b[0m');
    console.dir(result, { depth: null, colors: true });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'message' in error) {
      console.error('\x1b[31mНе удалось связаться с запущенным сервисом:\x1b[0m', error.message);
    } else {
      console.error('\x1b[31mНе удалось связаться с запущенным сервисом:\x1b[0m', error);
    }
    process.exit(1);
  }
}

/**
 * Парсер массива ['-f', '--target', 'main'] в объект { '-f': true, '--target': 'main' }
 */
function parseArgsToPayload(args: string[]): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  for (let i = 0; i < args.length; i++) {
    const current = args[i];

    if (current.startsWith('-')) {
      if (current.includes('=')) {
        const [key, value] = current.split('=');
        payload[key] = value;
      } else {
        const next = args[i + 1];
        if (next && !next.startsWith('-')) {
          payload[current] = next;
          i++;
        } else {
          payload[current] = true;
        }
      }
    } else {
      // Если передан позиционный аргумент без флага (например, app cmd value)
      payload[current] = true;
    }
  }

  return payload;
}

function setEnv(): void {
  const isProd = __dirname.includes('dist');
  const envMode = process.env.NODE_ENV || (isProd ? 'production' : 'development');
  try {
    const envPath = join(__dirname, '..', `.env.${envMode}`);
    loadEnvFile(envPath);
  } catch {
    try {
      loadEnvFile(join(__dirname, '..', '.env'));
    } catch {
      /* non critical */
    }
  }
}

bootstrap().catch((err) => {
  console.error('Критическая ошибка при запуске приложения:', err);
  process.exit(1);
});
