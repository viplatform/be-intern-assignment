import { CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from "typeorm";

// Similar to Django's AbstractBaseModel
export abstract class BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}