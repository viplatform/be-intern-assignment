import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { UserFollow } from "./UserFollow";
import { Post } from "./Post";

@Entity("users")  // Explicitly specify the table name
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => UserFollow, follow => follow.follower)
    following: UserFollow[];

    @OneToMany(() => UserFollow, follow => follow.following)
    followers: UserFollow[];

    @OneToMany(() => Post, post => post.author)
    posts: Post[];
}
