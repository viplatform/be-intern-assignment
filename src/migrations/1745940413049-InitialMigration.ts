import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1745940413049 implements MigrationInterface {
    name = 'InitialMigration1745940413049'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_follows" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "followerId" integer, "followingId" integer, CONSTRAINT "UQ_48050dfc1d2514f4c2059f155eb" UNIQUE ("followerId", "followingId"))`);
        await queryRunner.query(`CREATE TABLE "hashtags" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, CONSTRAINT "UQ_7fedde18872deb14e4889361d7b" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE INDEX "IDX_hashtags_name_search" ON "hashtags" ("name") `);
        await queryRunner.query(`CREATE TABLE "post_likes" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer, "postId" integer)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_post_likes_user_post" ON "post_likes" ("userId", "postId") `);
        await queryRunner.query(`CREATE TABLE "posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "content" text NOT NULL, "status" varchar(20) NOT NULL DEFAULT ('published'), "authorId" integer)`);
        await queryRunner.query(`CREATE INDEX "IDX_posts_author_status" ON "posts" ("authorId", "status") `);
        await queryRunner.query(`CREATE INDEX "IDX_posts_created_at" ON "posts" ("createdAt") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "email" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "posts_hashtags_hashtags" ("postsId" integer NOT NULL, "hashtagsId" integer NOT NULL, PRIMARY KEY ("postsId", "hashtagsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c52d9ed78d930e7dc28c5a93cf" ON "posts_hashtags_hashtags" ("postsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4664ee7d5459af42a58502b413" ON "posts_hashtags_hashtags" ("hashtagsId") `);
        await queryRunner.query(`CREATE TABLE "temporary_user_follows" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "followerId" integer, "followingId" integer, CONSTRAINT "UQ_48050dfc1d2514f4c2059f155eb" UNIQUE ("followerId", "followingId"), CONSTRAINT "FK_6300484b604263eaae8a6aab88d" FOREIGN KEY ("followerId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7c6c27f12c4e972eab4b3aaccbf" FOREIGN KEY ("followingId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_user_follows"("id", "createdAt", "updatedAt", "followerId", "followingId") SELECT "id", "createdAt", "updatedAt", "followerId", "followingId" FROM "user_follows"`);
        await queryRunner.query(`DROP TABLE "user_follows"`);
        await queryRunner.query(`ALTER TABLE "temporary_user_follows" RENAME TO "user_follows"`);
        await queryRunner.query(`DROP INDEX "IDX_post_likes_user_post"`);
        await queryRunner.query(`CREATE TABLE "temporary_post_likes" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer, "postId" integer, CONSTRAINT "FK_37d337ad54b1aa6b9a44415a498" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_6999d13aca25e33515210abaf16" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_post_likes"("id", "createdAt", "updatedAt", "userId", "postId") SELECT "id", "createdAt", "updatedAt", "userId", "postId" FROM "post_likes"`);
        await queryRunner.query(`DROP TABLE "post_likes"`);
        await queryRunner.query(`ALTER TABLE "temporary_post_likes" RENAME TO "post_likes"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_post_likes_user_post" ON "post_likes" ("userId", "postId") `);
        await queryRunner.query(`DROP INDEX "IDX_posts_author_status"`);
        await queryRunner.query(`DROP INDEX "IDX_posts_created_at"`);
        await queryRunner.query(`CREATE TABLE "temporary_posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "content" text NOT NULL, "status" varchar(20) NOT NULL DEFAULT ('published'), "authorId" integer, CONSTRAINT "FK_c5a322ad12a7bf95460c958e80e" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_posts"("id", "createdAt", "updatedAt", "content", "status", "authorId") SELECT "id", "createdAt", "updatedAt", "content", "status", "authorId" FROM "posts"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`ALTER TABLE "temporary_posts" RENAME TO "posts"`);
        await queryRunner.query(`CREATE INDEX "IDX_posts_author_status" ON "posts" ("authorId", "status") `);
        await queryRunner.query(`CREATE INDEX "IDX_posts_created_at" ON "posts" ("createdAt") `);
        await queryRunner.query(`DROP INDEX "IDX_c52d9ed78d930e7dc28c5a93cf"`);
        await queryRunner.query(`DROP INDEX "IDX_4664ee7d5459af42a58502b413"`);
        await queryRunner.query(`CREATE TABLE "temporary_posts_hashtags_hashtags" ("postsId" integer NOT NULL, "hashtagsId" integer NOT NULL, CONSTRAINT "FK_c52d9ed78d930e7dc28c5a93cff" FOREIGN KEY ("postsId") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_4664ee7d5459af42a58502b4139" FOREIGN KEY ("hashtagsId") REFERENCES "hashtags" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("postsId", "hashtagsId"))`);
        await queryRunner.query(`INSERT INTO "temporary_posts_hashtags_hashtags"("postsId", "hashtagsId") SELECT "postsId", "hashtagsId" FROM "posts_hashtags_hashtags"`);
        await queryRunner.query(`DROP TABLE "posts_hashtags_hashtags"`);
        await queryRunner.query(`ALTER TABLE "temporary_posts_hashtags_hashtags" RENAME TO "posts_hashtags_hashtags"`);
        await queryRunner.query(`CREATE INDEX "IDX_c52d9ed78d930e7dc28c5a93cf" ON "posts_hashtags_hashtags" ("postsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4664ee7d5459af42a58502b413" ON "posts_hashtags_hashtags" ("hashtagsId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_4664ee7d5459af42a58502b413"`);
        await queryRunner.query(`DROP INDEX "IDX_c52d9ed78d930e7dc28c5a93cf"`);
        await queryRunner.query(`ALTER TABLE "posts_hashtags_hashtags" RENAME TO "temporary_posts_hashtags_hashtags"`);
        await queryRunner.query(`CREATE TABLE "posts_hashtags_hashtags" ("postsId" integer NOT NULL, "hashtagsId" integer NOT NULL, PRIMARY KEY ("postsId", "hashtagsId"))`);
        await queryRunner.query(`INSERT INTO "posts_hashtags_hashtags"("postsId", "hashtagsId") SELECT "postsId", "hashtagsId" FROM "temporary_posts_hashtags_hashtags"`);
        await queryRunner.query(`DROP TABLE "temporary_posts_hashtags_hashtags"`);
        await queryRunner.query(`CREATE INDEX "IDX_4664ee7d5459af42a58502b413" ON "posts_hashtags_hashtags" ("hashtagsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c52d9ed78d930e7dc28c5a93cf" ON "posts_hashtags_hashtags" ("postsId") `);
        await queryRunner.query(`DROP INDEX "IDX_posts_created_at"`);
        await queryRunner.query(`DROP INDEX "IDX_posts_author_status"`);
        await queryRunner.query(`ALTER TABLE "posts" RENAME TO "temporary_posts"`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "content" text NOT NULL, "status" varchar(20) NOT NULL DEFAULT ('published'), "authorId" integer)`);
        await queryRunner.query(`INSERT INTO "posts"("id", "createdAt", "updatedAt", "content", "status", "authorId") SELECT "id", "createdAt", "updatedAt", "content", "status", "authorId" FROM "temporary_posts"`);
        await queryRunner.query(`DROP TABLE "temporary_posts"`);
        await queryRunner.query(`CREATE INDEX "IDX_posts_created_at" ON "posts" ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_posts_author_status" ON "posts" ("authorId", "status") `);
        await queryRunner.query(`DROP INDEX "IDX_post_likes_user_post"`);
        await queryRunner.query(`ALTER TABLE "post_likes" RENAME TO "temporary_post_likes"`);
        await queryRunner.query(`CREATE TABLE "post_likes" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer, "postId" integer)`);
        await queryRunner.query(`INSERT INTO "post_likes"("id", "createdAt", "updatedAt", "userId", "postId") SELECT "id", "createdAt", "updatedAt", "userId", "postId" FROM "temporary_post_likes"`);
        await queryRunner.query(`DROP TABLE "temporary_post_likes"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_post_likes_user_post" ON "post_likes" ("userId", "postId") `);
        await queryRunner.query(`ALTER TABLE "user_follows" RENAME TO "temporary_user_follows"`);
        await queryRunner.query(`CREATE TABLE "user_follows" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "followerId" integer, "followingId" integer, CONSTRAINT "UQ_48050dfc1d2514f4c2059f155eb" UNIQUE ("followerId", "followingId"))`);
        await queryRunner.query(`INSERT INTO "user_follows"("id", "createdAt", "updatedAt", "followerId", "followingId") SELECT "id", "createdAt", "updatedAt", "followerId", "followingId" FROM "temporary_user_follows"`);
        await queryRunner.query(`DROP TABLE "temporary_user_follows"`);
        await queryRunner.query(`DROP INDEX "IDX_4664ee7d5459af42a58502b413"`);
        await queryRunner.query(`DROP INDEX "IDX_c52d9ed78d930e7dc28c5a93cf"`);
        await queryRunner.query(`DROP TABLE "posts_hashtags_hashtags"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "IDX_posts_created_at"`);
        await queryRunner.query(`DROP INDEX "IDX_posts_author_status"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP INDEX "IDX_post_likes_user_post"`);
        await queryRunner.query(`DROP TABLE "post_likes"`);
        await queryRunner.query(`DROP INDEX "IDX_hashtags_name_search"`);
        await queryRunner.query(`DROP TABLE "hashtags"`);
        await queryRunner.query(`DROP TABLE "user_follows"`);
    }

}

