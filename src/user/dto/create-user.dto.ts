import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ type: Date })
  dateOfBirth: Date;

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}
