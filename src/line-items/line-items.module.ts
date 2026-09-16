import { Module } from '@nestjs/common';
import { LineItemsService } from './line-items.service';
import { LineItemsController } from './line-items.controller';
import { LineItem } from './entities/line-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@/orders/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LineItem, Order])],
  controllers: [LineItemsController],
  providers: [LineItemsService],
})
export class LineItemsModule {}
