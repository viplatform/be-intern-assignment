import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
  TableUnique,
} from 'typeorm';

export class CreateFollowTable1713427700000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'follows',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'followerId',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'followingId',
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
      'follows',
      new TableForeignKey({
        columnNames: ['followerId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'follows',
      new TableForeignKey({
        columnNames: ['followingId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createUniqueConstraint(
      'follows',
      new TableUnique({
        name: 'UQ_FOLLOWS_FOLLOWER_FOLLOWING',
        columnNames: ['followerId', 'followingId'],
      })
    );

    await queryRunner.createIndex(
      'follows',
      new TableIndex({
        name: 'IDX_FOLLOWS_FOLLOWER_FOLLOWING',
        columnNames: ['followerId', 'followingId'],
      })
    );

    await queryRunner.createIndex(
      'follows',
      new TableIndex({
        name: 'IDX_FOLLOWS_FOLLOWER_ID',
        columnNames: ['followerId'],
      })
    );

    await queryRunner.createIndex(
      'follows',
      new TableIndex({
        name: 'IDX_FOLLOWS_FOLLOWING_ID',
        columnNames: ['followingId'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('follows', 'IDX_FOLLOWS_FOLLOWING_ID');
    await queryRunner.dropIndex('follows', 'IDX_FOLLOWS_FOLLOWER_ID');
    await queryRunner.dropIndex('follows', 'IDX_FOLLOWS_FOLLOWER_FOLLOWING');
    await queryRunner.dropUniqueConstraint('follows', 'UQ_FOLLOWS_FOLLOWER_FOLLOWING');
    await queryRunner.dropTable('follows');
  }
}
