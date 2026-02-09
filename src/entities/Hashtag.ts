import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  Index,
} from 'typeorm';
import { Post } from './Post';

@Entity('hashtags')
export class Hashtag {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => Post, (post) => post.hashtags)
  posts: Post[];
}
