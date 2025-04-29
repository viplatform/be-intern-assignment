import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { UserFollow } from "./entities/UserFollow";
import { Post } from "./entities/Post";
import { PostLike } from "./entities/PostLike";
import { Hashtag } from "./entities/Hashtag";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: false,
    logging: true,
    entities: [
        User,
        UserFollow,
        Post,
        PostLike,
        Hashtag
    ],
    migrations: ["src/migrations/*.ts"],
    migrationsTableName: "migrations"
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });