import { Entity, Column, ManyToOne, ManyToMany, JoinTable, OneToMany, Index } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { Hashtag } from "./Hashtag";
import { PostLike } from "./PostLike";

// Similar to Django's Choices
export enum PostStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    ARCHIVED = "archived",
    DELETED = "deleted"
}

@Entity("posts")
@Index("IDX_posts_created_at", ["createdAt"])
@Index("IDX_posts_author_status", ["author", "status"])
export class Post extends BaseEntity {
    @Column({ type: "text" })
    content: string;

    @Column({
        type: "varchar",
        length: 20,
        default: PostStatus.PUBLISHED
    })
    status: PostStatus;

    @ManyToOne(() => User, (user: User) => user.posts)
    author: User;

    @ManyToMany(() => Hashtag, (hashtag: Hashtag) => hashtag.posts)
    @JoinTable()
    hashtags: Hashtag[];

    @OneToMany(() => PostLike, (like: PostLike) => like.post)
    likes: PostLike[];
}
