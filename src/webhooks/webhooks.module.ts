import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { UsersModule } from '@/users/users.module';
import { OrdersModule } from '@/orders/orders.module';

@Module({
  imports: [UsersModule, OrdersModule],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksModule {}
