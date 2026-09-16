import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { EntityManager, Repository } from 'typeorm';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly entityManager: EntityManager,
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
}
