import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../user/dto/user.dto';

export class FriendshipDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  senderId: string;

  @ApiProperty()
  sender: UserDto;

  @ApiProperty()
  receiverId: string;

  @ApiProperty()
  receiver: UserDto;

  @ApiProperty()
  accepted: boolean;
}
