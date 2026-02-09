import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { User } from './User';

@Entity('follows')
@Unique(['followerId', 'followingId'])
@Index(['followerId', 'followingId'])
export class Follow {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int' })
  followerId: number;

  @Column({ type: 'int' })
  followingId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.following, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'followerId' })
  follower: User;

  @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'followingId' })
  following: User;
}
