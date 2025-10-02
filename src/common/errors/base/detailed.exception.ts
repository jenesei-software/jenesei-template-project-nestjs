import { ApiProperty } from '@nestjs/swagger';

export class DetailedException {
  @ApiProperty({ description: 'Имя поля, которое вызвало ошибку', example: 'username' })
  fieldName: string;

  @ApiProperty({
    description: 'Объяснения причины ошибки',
    example: 'username не может быть меньше 4 символов',
  })
  cause: string;
}
