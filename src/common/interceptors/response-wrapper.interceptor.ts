import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { RESPONSE_STATUS } from '../decorators';

@Injectable()
export class ResponseWrapperInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const status = this.reflector.getAllAndOverride<number>(RESPONSE_STATUS, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (status === 204) return next.handle();

    return next.handle().pipe(
      map((data) => ({
        ok: true,
        message: 'success',
        ...(data !== null && data !== undefined ? { result: data } : {}),
      })),
    );
  }
}
