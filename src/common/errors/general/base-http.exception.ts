import { HttpStatus } from '@nestjs/common';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { ExceptionText } from 'src/common/enums/exception-text';

export class BaseHttpException {
  @ApiHideProperty()
  statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

  @ApiProperty({ description: 'Внутренний код ошибки', example: HttpStatus.INTERNAL_SERVER_ERROR })
  code: number = HttpStatus.INTERNAL_SERVER_ERROR;

  @ApiProperty({
    description: 'Краткое описание ошибки',
    example: ExceptionText.InternalServerError,
  })
  error: string = ExceptionText.InternalServerError;

  @ApiProperty({ description: 'Причина ошибки' })
  cause: string | string[] = ExceptionText.InternalServerError;
}
