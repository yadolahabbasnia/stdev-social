import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendshipEntity } from './entities/friendship.entity';
import { UserService } from '../user/user.service';
import { FriendshipDto } from './dto/friendship.dto';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(FriendshipEntity)
    private readonly friendRequestRepository: Repository<FriendshipEntity>,
    private readonly userService: UserService,
  ) {}

  async sendFriendRequest(
    senderId: string,
    receiverId: string,
  ): Promise<FriendshipDto> {
    if (senderId === receiverId) {
      throw new ForbiddenException(
        'You can not send friend request to yourself',
      );
    }

    const receiver = await this.userService.findById(receiverId);
    const sender = await this.userService.findById(senderId);

    if (!sender || !receiver) {
      throw new NotFoundException('One of the users does not exist');
    }

    const friendRequest = {
      receiver,
      sender,
      senderId,
      receiverId,
    };
    return this.friendRequestRepository.save(friendRequest);
  }

  async getFriendRequestsForUser(receiverId: string): Promise<FriendshipDto[]> {
    const friendRequests = await this.friendRequestRepository.find({
      where: { receiverId, accepted: false },
      relations: ['sender'],
    });

    return friendRequests;
  }

  async acceptFriendRequest(receiverId: string, id: string): Promise<void> {
    await this.friendRequestExists(receiverId, id);

    await this.friendRequestRepository.update(id, { accepted: true });
  }

  async declineFriendRequest(receiverId: string, id: string): Promise<void> {
    await this.friendRequestExists(receiverId, id);
    await this.friendRequestRepository.update(id, { accepted: false });
  }

  async friendRequestExists(receiverId: string, id: string) {
    const request = await this.friendRequestRepository.findOne({
      where: { receiverId, id },
    });
    if (!request) {
      throw new NotFoundException('Friend request not found');
    }
  }
}
