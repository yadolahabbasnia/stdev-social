import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

@Entity()
export class FriendshipEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  senderId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'senderId' })
  sender: UserEntity;

  @Column()
  receiverId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'receiverId' })
  receiver: UserEntity;

  @Column({ default: false })
  accepted: boolean;
}
