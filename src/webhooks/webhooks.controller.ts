import { Body, Controller, Headers, Post, Req } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { Public } from '@/auth/public.decorator';

interface ShopifyRequest extends Request {
  rawBody: Buffer;
}

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Public()
  @Post('shopify/customer')
  async handleCustomerWebhook(
    @Body() body: any,
    @Headers('x-shopify-hmac-sha256') hmac: string,
    @Req() request: ShopifyRequest,
  ) {
    return this.webhooksService.handleCustomerWebhook(
      body,
      request.rawBody,
      hmac,
    );
  }
}
