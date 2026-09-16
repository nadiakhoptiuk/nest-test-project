import { LineItem } from '@/line-items/entities/line-item.entity';
import { User } from '@/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  orderNumber: string;

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
  total: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  currency: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.orders, {
    nullable: true,
  })
  user: User | null;

  @OneToMany(() => LineItem, (lineItem) => lineItem.order)
  lineItems: LineItem[];

  constructor(
    order: Omit<
      Order,
      'id' | 'user' | 'orderNumber' | 'createdAt' | 'updatedAt'
    >,
  ) {
    Object.assign(this, order);
  }
}
