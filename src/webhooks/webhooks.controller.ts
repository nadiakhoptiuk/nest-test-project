import { Body, Controller, Headers, Post } from '@nestjs/common';
import { Public } from '@/auth/public.decorator';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import type { ShopifyCustomerWebhook } from '@/users/users.types';
import type { ShopifyOrderWebhook } from '@/orders/order.types';

@Controller('webhooks')
export class WebhooksController {
  constructor(
    @InjectQueue('orders')
    private readonly ordersQueue: Queue,

    @InjectQueue('users')
    private readonly usersQueue: Queue,
  ) {}

  @Public()
  @Post('shopify/customer')
  async handleCustomerWebhook(
    @Body() body: ShopifyCustomerWebhook,
    @Headers('x-shopify-topic') topic: string,
  ) {
    console.log('user-webhook');
    await this.usersQueue.add('user-webhook', {
      topic,
      body,
    });

    return { received: true };
  }

  @Public()
  @Post('shopify/order')
  async handleOrderWebhook(
    @Body() body: ShopifyOrderWebhook,
    @Headers('x-shopify-topic') topic: string,
  ) {
    try {
      await this.ordersQueue.add('order-webhook', {
        topic,
        body,
      });

      return { received: true };
    } catch (error) {
      console.error('❌ queue error:', error);

      throw error;
    }
  }
}
