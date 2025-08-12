import { ExceptionCode } from '@common/enums/exception-code';
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { BaseHttpException } from './base-http.exception';
import { DetailedException } from './detailed.exception';

export class BadRequestException extends BaseHttpException {
  statusCode: HttpStatus = HttpStatus.BAD_REQUEST;

  @ApiProperty({ example: ExceptionCode.BAD_REQUEST })
  code: string = ExceptionCode.BAD_REQUEST;

  @ApiProperty({ example: ExceptionCode.BAD_REQUEST })
  error: string = ExceptionCode.FORBIDDEN;

  @ApiProperty({ example: 'Некорректный запрос' })
  message: string = 'Некорректный запрос';

  @ApiProperty({ required: true })
  detailed: DetailedException[];

  constructor(detailed: DetailedException[]) {
    super();
    this.detailed = detailed;
  }
}
