import { ExceptionCode } from '@common/enums/exception-code';
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { BaseHttpException } from './base-http.exception';

export class ForbiddenException extends BaseHttpException {
  statusCode: HttpStatus = HttpStatus.FORBIDDEN;

  @ApiProperty({ example: ExceptionCode.FORBIDDEN })
  code: string = ExceptionCode.FORBIDDEN;

  @ApiProperty({ example: ExceptionCode.FORBIDDEN })
  error: string = ExceptionCode.FORBIDDEN;

  @ApiProperty({ example: 'Доступ к ресурсу запрещен' })
  message: string = 'Доступ к ресурсу запрещен';
}
