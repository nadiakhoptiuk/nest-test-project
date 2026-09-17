import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { OrdersService } from './orders.service';
import { OrderWebhookJobData } from './order.types';

@Processor('orders')
export class OrdersProcessor extends WorkerHost {
  constructor(private readonly ordersService: OrdersService) {
    super();
  }

  async process(job: Job<OrderWebhookJobData>) {
    if (job.name === 'order-webhook') {
      const { body, topic } = job.data;

      console.log('Processing order webhook:', {
        orderId: body.id,
      });

      await this.ordersService.handleOrderWebhook(body, topic);
    }
  }
}
