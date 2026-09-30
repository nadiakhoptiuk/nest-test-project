import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSupportRequestDto } from './dto/create-support-request.dto';
import { SupportRequest } from './entities/support-request.entity';
import { format } from 'date-fns';
import { getShopifyLink } from '@/utils/getShopifyLink';
import { Order } from '@/orders/entities/order.entity';
import { User } from '@/users/entities/user.entity';

interface SlackResponse {
  ok: boolean;
  error?: string;
  ts?: string;
  channel?: string;
}

@Injectable()
export class SupportRequestsService {
  constructor(
    @InjectRepository(SupportRequest)
    private readonly supportRequestRepository: Repository<SupportRequest>,
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createSupportRequest(data: CreateSupportRequestDto): Promise<void> {
    const token = process.env.SLACK_BOT_TOKEN;
    const channelId = process.env.SLACK_CHANNEL_ID;

    if (!token || !channelId) {
      throw new UnauthorizedException(
        'Slack bot token or channel Id is not configured',
      );
    }

    const requestDate = format(new Date(data.date), 'PPP');
    const customerLink = getShopifyLink(data.domain, data.customerGID, 'user');
    const orderLink = getShopifyLink(
      data.domain,
      data.orderShopifyGID,
      'order',
    );

    const message = `
       Customer Support Request (${requestDate})

      Customer: ${data.customerFullName} ${customerLink}
      Email: ${data.customerEmail}
      Order: ${orderLink}

      Message:
      ${data.message}
      `;

    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel: channelId,
        text: message,
      }),
    });

    const responseData: SlackResponse =
      (await response.json()) as SlackResponse;

    if (
      typeof responseData !== 'object' ||
      responseData === null ||
      !('ok' in responseData) ||
      typeof responseData.ok !== 'boolean'
    ) {
      throw new Error('Invalid response from Slack');
    }

    if (!responseData.ok) {
      throw new Error(`Slack API error: ${responseData?.error}`);
    }

    let userToConnect: User | null = null;
    const existingUser = await this.usersRepository.findOneBy({
      shopifyGID: data.customerGID,
    });

    console.log(existingUser);

    if (!existingUser) {
      const newUser = this.usersRepository.create({
        firstName: data?.customerFirstName,
        lastName: data?.customerLastName,
        email: data?.customerEmail,
        shopifyGID: data.customerGID,
      });

      userToConnect = await this.usersRepository.save(newUser);
    } else {
      userToConnect = existingUser;
    }

    // Save to database
    const supportRequest = this.supportRequestRepository.create({
      domain: data.domain,
      message: data.message,
      customerEmail: data.customerEmail,
      customerFullName: data.customerFullName,
      requestDate: new Date(data.date),
      user: userToConnect,
    });

    await this.supportRequestRepository.save(supportRequest);
  }
}
