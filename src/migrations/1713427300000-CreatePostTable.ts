import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreatePostTable1713427300000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'posts',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'content',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'userId',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'posts',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createIndex(
      'posts',
      new TableIndex({
        name: 'IDX_POSTS_USER_ID',
        columnNames: ['userId'],
      })
    );

    await queryRunner.createIndex(
      'posts',
      new TableIndex({
        name: 'IDX_POSTS_CREATED_AT',
        columnNames: ['createdAt'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('posts', 'IDX_POSTS_CREATED_AT');
    await queryRunner.dropIndex('posts', 'IDX_POSTS_USER_ID');
    await queryRunner.dropTable('posts');
  }
}
