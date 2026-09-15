import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';

export interface ShopifyCustomerWebhook {
  id: number;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  verified_email: boolean;
  state: string;
  created_at: string;
  updated_at: string;
}

@Injectable()
export class WebhooksService {
  constructor(private readonly usersService: UsersService) {}

  async handleCustomerWebhook(
    body: ShopifyCustomerWebhook,
    rawBody: Buffer,
    hmacHeader: string,
  ) {
    const secret = process.env.SHOPIFY_WEBHOOK_SECRET;

    if (!secret) {
      throw new UnauthorizedException('Missing Shopify webhook secret');
    }

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

    if (!body?.email || !body?.last_name) {
      throw new NotFoundException();
    }

    const user = await this.usersService.findByEmail(body.email);
    if (!user) {
      await this.usersService.create({
        firstName: body.first_name,
        lastName: body.last_name,
        email: body.email,
        password: '12345678',
      });
    } else {
      const updates: Partial<User> = {};

      if (user.firstName !== body.first_name) {
        updates.firstName = body.first_name;
      }

      if (user.lastName !== body.last_name) {
        updates.lastName = body.last_name;
      }

      if (user.email !== body.email) {
        updates.email = body.email;
      }

      if (Object.keys(updates).length > 0) {
        await this.usersService.update(user.id, updates);
      }
    }

    return { received: true };
  }
}
