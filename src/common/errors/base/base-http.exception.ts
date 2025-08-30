import { ExceptionCode } from '@common/enums/exception-code';
import { HttpStatus } from '@nestjs/common';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { DetailedException } from './detailed.exception';

export abstract class BaseHttpException {
  @ApiHideProperty()
  statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

  @ApiProperty({
    description: 'Кодовое представление ошибки',
    example: ExceptionCode.INTERNAL_SERVER_ERROR,
  })
  code: string = ExceptionCode.INTERNAL_SERVER_ERROR;

  @ApiProperty({
    description: 'HTTP код ошибки',
    example: ExceptionCode.INTERNAL_SERVER_ERROR,
  })
  error: string = ExceptionCode.INTERNAL_SERVER_ERROR;

  @ApiProperty({ description: 'Описание ошибка', example: 'Внутренняя ошибка сервера' })
  message: string = 'Внутренняя ошибка сервера';

  @ApiProperty({ description: 'Детали ошибки', isArray: true, required: false })
  detailed?: DetailedException[];
}
