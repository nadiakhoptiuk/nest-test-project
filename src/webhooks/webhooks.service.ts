import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class WebhooksService {
  constructor(private readonly logger: PinoLogger) {}
}
