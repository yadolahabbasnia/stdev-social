import { ApiProperty } from '@nestjs/swagger';

export class FindAllUserDto {
  @ApiProperty({ required: false })
  firstName?: string;

  @ApiProperty({ required: false })
  lastName?: string;

  @ApiProperty({ required: false })
  age?: number;

  userId?: string;
}
