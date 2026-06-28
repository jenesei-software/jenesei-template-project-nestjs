import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { DomainException } from './domain.exception';
import { EXCEPTION_STATUS_MAP } from './exception-status.map';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    if (exception instanceof DomainException) {
      const status = EXCEPTION_STATUS_MAP.get(exception.code) ?? HttpStatus.BAD_REQUEST;
      response.status(status).send({
        ok: false,
        message: exception.message,
        code: exception.code,
        ...(exception.errors ? { errors: exception.errors } : {}),
      });
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as Record<string, unknown>).message;

      const errors = Array.isArray(message) ? (message as string[]) : undefined;
      const singleMessage = Array.isArray(message) ? 'Validation error' : (message as string);

      response.status(status).send({
        ok: false,
        message: singleMessage,
        code: HttpStatus[status] ?? 'INTERNAL_SERVER_ERROR',
        ...(errors ? { errors } : {}),
      });
      return;
    }

    this.logger.error('Unexpected error', exception instanceof Error ? exception.stack : exception);

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      ok: false,
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
}
