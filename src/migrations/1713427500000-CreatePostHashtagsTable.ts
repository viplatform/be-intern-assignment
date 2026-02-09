import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreatePostHashtagsTable1713427500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'post_hashtags',
        columns: [
          {
            name: 'postId',
            type: 'integer',
            isPrimary: true,
          },
          {
            name: 'hashtagId',
            type: 'integer',
            isPrimary: true,
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'post_hashtags',
      new TableForeignKey({
        columnNames: ['postId'],
        referencedTableName: 'posts',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'post_hashtags',
      new TableForeignKey({
        columnNames: ['hashtagId'],
        referencedTableName: 'hashtags',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createIndex(
      'post_hashtags',
      new TableIndex({
        name: 'IDX_POST_HASHTAGS_POST_ID',
        columnNames: ['postId'],
      })
    );

    await queryRunner.createIndex(
      'post_hashtags',
      new TableIndex({
        name: 'IDX_POST_HASHTAGS_HASHTAG_ID',
        columnNames: ['hashtagId'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('post_hashtags', 'IDX_POST_HASHTAGS_HASHTAG_ID');
    await queryRunner.dropIndex('post_hashtags', 'IDX_POST_HASHTAGS_POST_ID');
    await queryRunner.dropTable('post_hashtags');
  }
}
