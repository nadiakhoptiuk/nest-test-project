import { Injectable, NotFoundException } from '@nestjs/common';
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

    @InjectRepository(Order)
    private readonly usersRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { userId, ...orderData } = createOrderDto;

    const user = await this.entityManager.findOneBy(User, {
      id: userId,
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const newOrder = this.ordersRepository.create({
      ...orderData,
      user,
    });
    return await this.ordersRepository.save(newOrder);
  }

  findAll() {
    return this.ordersRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
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

    return this.ordersRepository.update(id, {
      ...orderData,
      ...(user && { user }),
    });
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
