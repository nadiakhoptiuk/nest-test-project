import { Order } from '@/orders/entities/order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
  GHOST = 'ghost',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: true,
  })
  shopifyGID: string | null;

  @Column({
    type: 'varchar',
    length: 255,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(
    user: Omit<
      User,
      'id' | 'orders' | 'role' | 'shopifyGID' | 'createdAt' | 'updatedAt'
    >,
  ) {
    Object.assign(this, user);
  }
}
