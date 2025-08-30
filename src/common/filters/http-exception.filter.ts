import { BaseHttpException } from '@errors/base/base-http.exception';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch(BaseHttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: BaseHttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { code, error, message, statusCode, detailed } = exception;
    response.status(statusCode).json({
      error,
      code,
      message,
      detailed,
    });
  }
}
