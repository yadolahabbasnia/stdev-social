import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { FriendshipEntity } from '../../friendship/entities/friendship.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  dateOfBirth: Date;

  @Column()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => FriendshipEntity, (request) => request.sender)
  sentFriendRequests: FriendshipEntity[];

  @OneToMany(() => FriendshipEntity, (request) => request.receiver)
  receivedFriendRequests: FriendshipEntity[];
}
