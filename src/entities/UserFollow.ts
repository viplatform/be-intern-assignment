import { Entity, ManyToOne, Unique } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";

// Similar to Django's unique_together
@Entity("user_follows")
@Unique(["follower", "following"])
export class UserFollow extends BaseEntity {
    @ManyToOne(() => User, user => user.following)
    follower: User;

    @ManyToOne(() => User, user => user.followers)
    following: User;
}
