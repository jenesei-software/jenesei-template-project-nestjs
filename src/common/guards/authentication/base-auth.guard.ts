import { UnauthorizedException } from '@errors/base';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { users } from '@settings/users';
import { Request, Response } from 'express';

export class BaseAuthGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      this.forbiddenResponse(response);
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');

    const [username, password] = credentials.split(':');

    const isAllowed = users[username] === password;
    if (isAllowed) {
      return true;
    }

    this.forbiddenResponse(response);
  }

  private forbiddenResponse(response: Response): never {
    response.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
    throw new UnauthorizedException();
  }
}
