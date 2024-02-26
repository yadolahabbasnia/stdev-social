import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Req,
  Patch,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FriendshipService } from './friendship.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { FriendshipDto } from './dto/friendship.dto';

@ApiTags('Friendship')
@ApiBearerAuth()
@ApiSecurity('bearerAuth')
@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post(':receiverId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    description: 'User can send friendship request to another users here',
    summary: 'Send request to user',
  })
  @ApiResponse({
    status: 200,
    description: 'Friendship request object',
    type: FriendshipDto,
  })
  @ApiResponse({
    status: 403,
    description: 'You can not send friend request to yourself',
    type: FriendshipDto,
  })
  async sendFriendRequest(
    @Param('receiverId') receiverId: string,
    @Req() req: Request,
  ): Promise<FriendshipDto> {
    const user = req['user'];
    return this.friendshipService.sendFriendRequest(user.id, receiverId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    description: 'User can view friendship requests here',
    summary: 'Friendship requests Array',
  })
  @ApiResponse({
    status: 200,
    description: 'Requests list',
    type: [FriendshipDto],
  })
  async getFriendRequestsForUser(
    @Req() req: Request,
  ): Promise<FriendshipDto[]> {
    const user = req['user'];
    return this.friendshipService.getFriendRequestsForUser(user.id);
  }

  @Patch(':requestId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    description: 'User can accept friendship request here',
    summary: 'Accept friendship request',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully accepted',
  })
  async acceptFriendRequest(
    @Param('requestId') requestId: string,
    @Req() req: Request,
  ): Promise<void> {
    const user = req['user'];
    await this.friendshipService.acceptFriendRequest(user._id, requestId);
  }

  @Delete(':requestId')
  @UseGuards(AuthGuard())
  @ApiOperation({
    description: 'User can decline friendship request here',
    summary: 'Decline friendship request',
  })
  @ApiResponse({
    status: 201,
    description: 'successfully declined',
  })
  async declineFriendRequest(
    @Param('requestId') requestId: string,
    @Req() req: Request,
  ): Promise<void> {
    const user = req['user'];
    await this.friendshipService.declineFriendRequest(user._id, requestId);
  }
}
