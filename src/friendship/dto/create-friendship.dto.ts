import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateFriendshipDto {
  @ApiProperty()
  @IsString()
  senderId: string;

  @ApiProperty()
  @IsString()
  receiverId: string;
}
