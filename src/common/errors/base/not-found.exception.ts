import { ExceptionCode } from '@common/enums/exception-code';
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { BaseHttpException } from './base-http.exception';

export class NotFoundException extends BaseHttpException {
  statusCode: HttpStatus = HttpStatus.NOT_FOUND;

  @ApiProperty({ example: ExceptionCode.NOT_FOUND })
  code: string = ExceptionCode.NOT_FOUND;

  @ApiProperty({ example: ExceptionCode.NOT_FOUND })
  error: string = ExceptionCode.NOT_FOUND;

  @ApiProperty({ example: 'Ресурс не найден' })
  message: string = 'Ресурс не найден';
}
