import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: false, // Do not use synchronize, write migrations instead
  logging: true,
  entities: ['src/entities/**/*.ts'],
  subscribers: [],
  migrations: ['src/migrations/**/*.ts'],
});
