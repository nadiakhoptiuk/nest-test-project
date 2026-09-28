import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateSupportRequestDto } from './dto/create-support-request.dto';
import { format } from 'date-fns';
import { getShopifyLink } from '@/utils/getShopifyLink';

interface SlackResponse {
  ok: boolean;
  error?: string;
  ts?: string;
  channel?: string;
}

@Injectable()
export class SupportService {
  async sendMessageToSlack(data: CreateSupportRequestDto): Promise<void> {
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
  }
}
