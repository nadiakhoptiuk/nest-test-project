import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import { NextFunction, Request, Response } from 'express';

interface ShopifyRequest extends Request {
  rawBody: Buffer;
}

@Injectable()
export class ShopifyWebhookMiddleware implements NestMiddleware {
  use(req: ShopifyRequest, res: Response, next: NextFunction) {
    const secret = process.env.SHOPIFY_WEBHOOK_SECRET;

    if (!secret) {
      throw new UnauthorizedException(
        'Shopify webhook secret is not configured',
      );
    }

    const hmacHeader = req.headers['x-shopify-hmac-sha256'];

    if (!hmacHeader || Array.isArray(hmacHeader)) {
      throw new UnauthorizedException('Missing Shopify webhook signature');
    }

    const rawBody = req.rawBody;

    const generatedHmac = createHmac('sha256', secret)
      .update(rawBody)
      .digest('base64');

    const generatedBuffer = Buffer.from(generatedHmac, 'utf8');
    const receivedBuffer = Buffer.from(hmacHeader, 'utf8');

    const isValid =
      generatedBuffer.length === receivedBuffer.length &&
      timingSafeEqual(generatedBuffer, receivedBuffer);

    if (!isValid) {
      throw new UnauthorizedException('Invalid Shopify webhook signature');
    }

    next();
  }
}
