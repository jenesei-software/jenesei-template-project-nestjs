import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseEntity<T> {
  @ApiProperty({ description: '', example: HttpStatus.OK })
  code: number;

  @ApiProperty({ description: '', example: 'success' })
  data: T | string;

  constructor(data: T | string = 'success', code: number = 200) {
    this.code = code;
    this.data = data;
  }

  public static ok<T>(data: T | string = 'success', code: number = 200): ResponseEntity<T> {
    return new ResponseEntity(data, code);
  }
}
