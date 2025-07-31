import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from './base-http.exception';
import { ApiProperty } from '@nestjs/swagger';
import { ExceptionText } from 'src/common/enums/exception-text';

export class UnauthorizedException extends BaseHttpException {
  statusCode: HttpStatus = HttpStatus.UNAUTHORIZED;

  @ApiProperty({
    example: HttpStatus.UNAUTHORIZED,
  })
  code: number = HttpStatus.UNAUTHORIZED;

  @ApiProperty({ example: ExceptionText.Unauthorized })
  error: string = ExceptionText.Unauthorized;

  @ApiProperty({ example: 'Пользователь не авторизован' })
  cause: string = 'Пользователь не авторизован';
}
