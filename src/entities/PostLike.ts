import { Entity, ManyToOne, Index } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { Post } from "./Post";

@Entity("post_likes")
@Index("IDX_post_likes_user_post", ["user", "post"], { unique: true })
export class PostLike extends BaseEntity {
    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Post)
    post: Post;
}