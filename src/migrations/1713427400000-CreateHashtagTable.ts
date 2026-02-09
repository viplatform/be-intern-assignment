import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateHashtagTable1713427400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'hashtags',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isUnique: true,
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

    await queryRunner.createIndex(
      'hashtags',
      new TableIndex({
        name: 'IDX_HASHTAGS_NAME',
        columnNames: ['name'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('hashtags', 'IDX_HASHTAGS_NAME');
    await queryRunner.dropTable('hashtags');
  }
}
