import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportRequestsController } from './support-requests.controller';
import { SupportRequestsService } from './support-requests.service';
import { SupportRequest } from './entities/support-request.entity';
import { Order } from '@/orders/entities/order.entity';
import { User } from '@/users/entities/user.entity';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([SupportRequest, Order, User])],
  controllers: [SupportRequestsController],
  providers: [SupportRequestsService],
})
export class SupportModule {}
