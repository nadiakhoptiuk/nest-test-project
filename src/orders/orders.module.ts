import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { LineItem } from '@/line-items/entities/line-item.entity';
import { BullModule } from '@nestjs/bullmq';
import { UsersModule } from '@/users/users.module';
import { OrdersProcessor } from './orders.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, LineItem]),
    BullModule.registerQueue({
      name: 'orders',
    }),
    UsersModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersProcessor],
  exports: [OrdersService],
})
export class OrdersModule {}
