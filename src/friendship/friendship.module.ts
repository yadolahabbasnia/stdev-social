import { Module } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { FriendshipController } from './friendship.controller';
import { FriendshipEntity } from './entities/friendship.entity';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [FriendshipController],
  providers: [FriendshipService],
  imports: [
    TypeOrmModule.forFeature([FriendshipEntity]),
    PassportModule,
    UserModule,
  ],
})
export class FriendshipModule {}
