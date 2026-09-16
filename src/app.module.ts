import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { ProfilesModule } from './profiles/profiles.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { WebhooksModule } from './webhooks/webhooks.module';
import { LoggerModule } from 'nestjs-pino';
import { ShopifyWebhookMiddleware } from './webhooks/middleware/shopifyWebhookMiddleware';
import { LineItemsModule } from './line-items/line-items.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'info',
        autoLogging: false,
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    ProfilesModule,
    UsersModule,
    DatabaseModule,
    OrdersModule,
    AuthModule,
    WebhooksModule,
    LineItemsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ShopifyWebhookMiddleware).forRoutes({
      path: 'webhooks/shopify/*',
      method: RequestMethod.POST,
    });
  }
}
