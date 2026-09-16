import { Body, Controller, Headers, Post } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import type {
  ShopifyCustomerWebhook,
  ShopifyOrderWebhook,
} from './webhooks.service';
import { Public } from '@/auth/public.decorator';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Public()
  @Post('shopify/customer')
  async handleCustomerWebhook(
    @Body() body: ShopifyCustomerWebhook,
    @Headers('x-shopify-topic') topic: string,
  ) {
    return this.webhooksService.handleCustomerWebhook(body, topic);
  }

  @Public()
  @Post('shopify/order')
  async handleOrderWebhook(
    @Body() body: ShopifyOrderWebhook,
    @Headers('x-shopify-topic') topic: string,
  ) {
    return this.webhooksService.handleOrderWebhook(body, topic);
  }
}
