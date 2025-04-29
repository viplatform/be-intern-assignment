import { Entity, Column, ManyToMany, Index } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Post } from "./Post";

@Entity("hashtags")
export class Hashtag extends BaseEntity {
    @Column({ unique: true })
    @Index("IDX_hashtags_name_search")
    name: string;

    @ManyToMany(() => Post, post => post.hashtags)
    posts: Post[];
}
