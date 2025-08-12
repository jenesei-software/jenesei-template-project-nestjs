import { ExceptionCode } from '@common/enums/exception-code';
import { BaseHttpException } from './base-http.exception';
import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export class UnauthorizedException extends BaseHttpException {
  statusCode: HttpStatus = HttpStatus.UNAUTHORIZED;

  @ApiProperty({ example: ExceptionCode.UNAUTHORIZED })
  code: string = ExceptionCode.UNAUTHORIZED;

  @ApiProperty({ example: ExceptionCode.UNAUTHORIZED })
  error: string = ExceptionCode.UNAUTHORIZED;

  @ApiProperty({ example: 'Пользователь не авторизован' })
  message: string = 'Пользователь не авторизован';
}
