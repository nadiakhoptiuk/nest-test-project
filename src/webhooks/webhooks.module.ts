import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { UsersModule } from '@/users/users.module';
import { OrdersModule } from '@/orders/orders.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    UsersModule,
    OrdersModule,
    BullModule.registerQueue({
      name: 'users',
    }),
    BullModule.registerQueue({
      name: 'orders',
    }),
  ],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksModule {}
