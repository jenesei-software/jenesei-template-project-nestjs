import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { BaseHttpException } from '../errors/general/base-http.exception';

@Catch(BaseHttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: BaseHttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { code, error, cause, statusCode } = exception;
    response.status(statusCode).json({
      code,
      error,
      cause,
    });
  }
}
