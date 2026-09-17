import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CustomerWebhookJobData } from './users.types';
import { UsersService } from './users.service';

@Processor('users')
export class UsersProcessor extends WorkerHost {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  async process(job: Job<CustomerWebhookJobData>) {
    if (job.name === 'user-webhook') {
      const { body, topic } = job.data;

      console.log('Processing customer webhook:', {
        customerId: body.id,
      });

      await this.usersService.handleCustomerWebhook(body, topic);
    }
  }
}
