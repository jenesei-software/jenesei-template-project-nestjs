import { users } from './basic-users';
import { ConfigService } from '@nestjs/config';

export function enableBasicAuth(configService: ConfigService): void {
  const isEnable = configService.get<boolean>('server.basic.auth.enable') ?? false;

  if (!isEnable) {
    return;
  }
  const username = configService.getOrThrow<string>('server.basic.auth.username');
  const password = configService.getOrThrow<string>('server.basic.auth.password');

  users[username] = password;
}
