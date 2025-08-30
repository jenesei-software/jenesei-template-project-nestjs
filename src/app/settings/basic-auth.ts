import { ConfigService } from '@nestjs/config';
import { users } from './users';

export function enableBasicAuth(configService: ConfigService): void {
  const isEnable = configService.get<boolean>('server.basic.auth.enable') ?? false;

  if (!isEnable) {
    return;
  }
  const username = configService.getOrThrow<string>('server.basic.auth.username');
  const password = configService.getOrThrow<string>('server.basic.auth.password');

  users[username] = password;
}
