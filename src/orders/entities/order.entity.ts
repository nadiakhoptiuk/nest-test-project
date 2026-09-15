import { User } from '@/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CurrencyEnum {
  USD = 'USD',
  CAD = 'CAD',
  UAH = 'UAH',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  orderNumber: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  total: number;

  @Column({
    type: 'enum',
    enum: CurrencyEnum,
  })
  currency: CurrencyEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  constructor(
    order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>,
  ) {
    Object.assign(this, order);
  }
}
