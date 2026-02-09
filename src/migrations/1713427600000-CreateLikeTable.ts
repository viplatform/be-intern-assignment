import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
  TableUnique,
} from 'typeorm';

export class CreateLikeTable1713427600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'likes',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'userId',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'postId',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'likes',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'likes',
      new TableForeignKey({
        columnNames: ['postId'],
        referencedTableName: 'posts',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createUniqueConstraint(
      'likes',
      new TableUnique({
        name: 'UQ_LIKES_USER_POST',
        columnNames: ['userId', 'postId'],
      })
    );

    await queryRunner.createIndex(
      'likes',
      new TableIndex({
        name: 'IDX_LIKES_USER_POST',
        columnNames: ['userId', 'postId'],
      })
    );

    await queryRunner.createIndex(
      'likes',
      new TableIndex({
        name: 'IDX_LIKES_POST_ID',
        columnNames: ['postId'],
      })
    );

    await queryRunner.createIndex(
      'likes',
      new TableIndex({
        name: 'IDX_LIKES_USER_ID',
        columnNames: ['userId'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('likes', 'IDX_LIKES_USER_ID');
    await queryRunner.dropIndex('likes', 'IDX_LIKES_POST_ID');
    await queryRunner.dropIndex('likes', 'IDX_LIKES_USER_POST');
    await queryRunner.dropUniqueConstraint('likes', 'UQ_LIKES_USER_POST');
    await queryRunner.dropTable('likes');
  }
}
