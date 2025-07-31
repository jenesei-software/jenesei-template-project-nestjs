import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from './base-http.exception';
import { ApiProperty } from '@nestjs/swagger';
import { ExceptionText } from 'src/common/enums/exception-text';

export class ValidationException extends BaseHttpException {
  statusCode: HttpStatus = HttpStatus.BAD_REQUEST;

  @ApiProperty({
    example: HttpStatus.BAD_REQUEST,
  })
  code: number = HttpStatus.BAD_REQUEST;

  @ApiProperty({ example: ExceptionText.BadRequest })
  error: string = ExceptionText.BadRequest;

  @ApiProperty({ example: 'Ошибка валидации' })
  cause: string = 'Ошибка валидации';

  constructor(cause?: string) {
    super();
    this.cause = cause;
  }
}
