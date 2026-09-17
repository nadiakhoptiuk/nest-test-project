import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { EntityManager, Repository } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { ShopifyOrderWebhook } from './order.types';
import { PinoLogger } from 'nestjs-pino';
import { getGID } from '@/utils/fomatShopifyId';
import { UsersService } from '@/users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly entityManager: EntityManager,
    private readonly usersService: UsersService,
    private readonly logger: PinoLogger,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { userId, ...orderData } = createOrderDto;

    let user: User | null = null;

    if (userId != null) {
      user = await this.entityManager.findOneBy(User, {
        id: userId,
      });

      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
    }

    const newOrder = this.ordersRepository.create({
      ...orderData,
      user,
    });

    return this.ordersRepository.save(newOrder);
  }

  findAll() {
    return this.ordersRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  async findByShopifyGID(shopifyGID: string) {
    if (!shopifyGID.trim()) {
      throw new BadRequestException('Invalid or missing Shopify GID');
    }

    return this.ordersRepository.findOneBy({ shopifyGID });
  }

  async findByOrderName(orderName: string) {
    if (!orderName.trim()) {
      throw new BadRequestException('Invalid or missing Shopify order name');
    }

    return this.ordersRepository.findOneBy({ orderNumber: orderName });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const { userId, ...orderData } = updateOrderDto;

    let user: User | undefined;
    if (userId !== undefined) {
      const found = await this.entityManager.findOneBy(User, {
        id: userId,
      });

      if (!found) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }

      user = found;
    }

    await this.ordersRepository.update(id, {
      ...orderData,
      ...(user && { user }),
    });

    const updatedOrder = await this.ordersRepository.findOne({
      where: { id },
    });

    if (!updatedOrder) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return updatedOrder;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
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
    const existingOrder = await this.findByShopifyGID(orderGID);

    if (!existingOrder) {
      const order = await this.findByOrderName(body.name);

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

      const updatedOrder = await this.update(orderToUpd.id, updates);

      if (updatedOrder) {
        this.logger.info(
          `Order with ID ${updatedOrder.id} (${updatedOrder.orderNumber}) was successfully updated.`,
        );
      }
    } else {
      const createdOrder = await this.create(orderData);

      if (createdOrder) {
        this.logger.info(
          `Order with ID ${createdOrder.id} and number (${createdOrder.orderNumber}) was successfully created.`,
        );
      }
    }

    return { received: true };
  }
}
