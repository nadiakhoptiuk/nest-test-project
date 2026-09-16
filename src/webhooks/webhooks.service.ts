import { CreateOrderDto } from '@/orders/dto/create-order.dto';
import { Order } from '@/orders/entities/order.entity';
import { OrdersService } from '@/orders/orders.service';
import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';
import { getGID } from '@/utils/fomatShopifyId';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

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

export interface ShopifyOrderWebhook {
  id: number;
  admin_graphql_api_id: string;
  name: string;
  order_number: number;
  email: string | null;
  contact_email: string | null;
  phone: string | null;
  currency: string;
  presentment_currency: string;
  subtotal_price: string | null;
  total_price: string | null;
  total_discounts: string | null;
  total_tax: string | null;
  total_shipping_price_set: ShopifyMoneySet | null;
  financial_status: string | null;
  fulfillment_status: string | null;
  cancel_reason: string | null;
  cancelled_at: string | null;
  confirmed: boolean;
  test: boolean;
  created_at: string;
  updated_at: string;
  processed_at: string | null;
  closed_at: string | null;
  customer: ShopifyOrderCustomer | null;
  line_items: ShopifyOrderLineItem[];
}

export interface ShopifyOrderCustomer {
  id: number;
  admin_graphql_api_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  state: string;
  verified_email: boolean;
  currency: string;
  default_address: ShopifyAddress | null;
}

export interface ShopifyOrderLineItem {
  id: number;
  admin_graphql_api_id: string;
  name: string;
  title: string;
  price: string;
  quantity: number;
  current_quantity: number;
  fulfillable_quantity: number;
  sku: string | null;
  product_id: number | null;
  variant_id: number | null;
  product_exists: boolean;
  requires_shipping: boolean;
  taxable: boolean;
  fulfillment_service: string | null;
  fulfillment_status: string | null;
  gift_card: boolean;
  variant_title: string | null;
  total_discount: string;
}

export interface ShopifyMoneySet {
  shop_money: ShopifyMoney;
  presentment_money: ShopifyMoney;
}

export interface ShopifyMoney {
  amount: string;
  currency_code: string;
}

export interface ShopifyAddress {
  first_name: string | null;
  last_name: string | null;

  address1: string | null;
  address2: string | null;

  city: string | null;
  province: string | null;
  province_code: string | null;

  country: string | null;
  country_code: string | null;

  zip: string | null;
  phone: string | null;

  company: string | null;
  name: string | null;
}

@Injectable()
export class WebhooksService {
  constructor(
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
    private readonly logger: PinoLogger,
  ) {}

  async handleCustomerWebhook(body: ShopifyCustomerWebhook, topic: string) {
    if (topic !== 'customers/update' && topic !== 'customers/create') {
      const errorMessage = `Shopify Webhook received. Topic ${topic} is not supported`;
      this.logger.error(errorMessage);
      throw new UnauthorizedException(errorMessage);
    }

    this.logger.info(`✅ Shopify webhook verified. Topic: ${topic}`);

    if (!body?.email || !body?.last_name) {
      throw new NotFoundException();
    }

    const userGID = getGID(body.id, 'user');

    let userToUpd: User = null;
    const existingUser = await this.usersService.findByShopifyGID(userGID);

    if (!existingUser) {
      const user = await this.usersService.findByEmail(body.email);

      if (user && user.shopifyGID !== userGID) {
        userToUpd = user;
      }
    } else {
      this.logger.info(
        `Found user by Shopify ID (${userGID}): ${existingUser.id} (${existingUser.firstName} ${existingUser.lastName ?? ''})`,
      );
      userToUpd = existingUser;
    }

    if (userToUpd) {
      const updates: Partial<User> = {};

      if (userToUpd.firstName !== body.first_name) {
        updates.firstName = body.first_name;
      }

      if (userToUpd.lastName !== body.last_name) {
        updates.lastName = body.last_name;
      }

      if (userToUpd.email !== body.email) {
        updates.email = body.email;
      }

      if (Object.keys(updates).length > 0) {
        const updatedUser = await this.usersService.update(
          userToUpd.id,
          updates,
        );

        if (updatedUser) {
          this.logger.info(
            `User with ID ${updatedUser.id} (${updatedUser.firstName} ${updatedUser.lastName ?? ''}) was successfully updated.`,
          );
        }
      }
    } else {
      const createdUser = await this.usersService.create({
        firstName: body.first_name,
        lastName: body.last_name,
        email: body.email,
        password: '12345678',
        shopifyGID: userGID,
      });

      if (createdUser) {
        this.logger.info(
          `User with ID ${createdUser.id} (${createdUser.firstName} ${createdUser.lastName ?? ''}) was successfully created.`,
        );
      }
    }

    return { received: true };
  }

  async handleOrderWebhook(body: ShopifyOrderWebhook, topic: string) {
    console.log(topic);
    if (topic !== 'orders/updated') {
      const errorMessage = `Shopify Webhook received. Topic ${topic} is not supported`;
      this.logger.error(errorMessage);
      throw new UnauthorizedException(errorMessage);
    }

    this.logger.info(`✅ Shopify webhook verified. Topic: ${topic}`);

    if (!body?.name || !body?.admin_graphql_api_id) {
      throw new NotFoundException();
    }

    const orderGID = getGID(body.admin_graphql_api_id, 'order');

    let orderToUpd: Order | null = null;
    const existingOrder = await this.ordersService.findByShopifyGID(orderGID);

    if (!existingOrder) {
      const order = await this.ordersService.findByOrderName(body.name);

      if (order && order.shopifyGID !== orderGID) {
        orderToUpd = order;
      }
    } else {
      this.logger.info(
        `Found order by Shopify ID (${orderGID}): ${existingOrder.id} (${existingOrder.orderNumber})`,
      );
      orderToUpd = existingOrder;
    }

    let customerDBId: number = null;
    const customerShopifyGID = body.customer?.admin_graphql_api_id
      ? body.customer?.admin_graphql_api_id
      : body.customer?.id
        ? getGID(body.customer.id, 'user')
        : null;

    if (customerShopifyGID) {
      const customer =
        await this.usersService.findByShopifyGID(customerShopifyGID);

      if (customer) {
        customerDBId = customer.id;
      } else {
        const newCustomer = await this.usersService.create({
          email: body.customer.email,
          shopifyGID: body.customer?.admin_graphql_api_id,
          firstName: body.customer.first_name,
          lastName: body.customer.last_name,
          password: '12345678',
        });

        customerDBId = newCustomer.id;
      }
    }

    const orderData: CreateOrderDto = {
      userId: customerDBId || null,
      orderNumber: body.name,
      shopifyGID: orderGID,
      currency: body.currency,
      total: parseFloat(body.total_price),
    };

    if (orderToUpd) {
      const updates: Partial<Order> = orderData;

      const updatedOrder = await this.ordersService.update(
        orderToUpd.id,
        updates,
      );

      if (updatedOrder) {
        this.logger.info(
          `Order with ID ${updatedOrder.id} (${updatedOrder.orderNumber}) was successfully updated.`,
        );
      }
    } else {
      const createdOrder = await this.ordersService.create(orderData);

      if (createdOrder) {
        this.logger.info(
          `Order with ID ${createdOrder.id} and number (${createdOrder.orderNumber}) was successfully created.`,
        );
      }
    }

    return { received: true };
  }
}
