import { Order } from '@/orders/entities/order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class LineItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  shopifyGID: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price: number;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  currency: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Order, (order) => order.lineItems)
  order: Order;

  constructor(lineItem: Omit<LineItem, 'id' | 'createdAt' | 'updatedAt'>) {
    Object.assign(this, lineItem);
  }
}
