import { Order } from '@/orders/entities/order.entity';
import { User } from '@/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('support_requests')
export class SupportRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  domain: string;

  @Column({
    type: 'text',
  })
  message: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'customer_email',
  })
  customerEmail: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'customer_full_name',
  })
  customerFullName: string;

  @Column({
    type: 'timestamp',
    name: 'request_date',
  })
  requestDate: Date;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @OneToOne(() => Order, (order) => order.id)
  order: Order;

  @OneToOne(() => User, (user) => user.id)
  user: User;
}
