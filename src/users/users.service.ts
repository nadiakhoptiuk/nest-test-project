import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { PinoLogger } from 'nestjs-pino';
import { ShopifyCustomerWebhook } from './users.types';
import { getGID } from '@/utils/fomatShopifyId';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    private readonly logger: PinoLogger,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      SALT_ROUNDS,
    );
    const user = new User({ ...createUserDto, password: hashedPassword });
    await this.entityManager.save(user);
    return user;
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  async findByShopifyGID(shopifyGID: string) {
    if (!shopifyGID.trim()) {
      throw new BadRequestException('Invalid or missing Shopify GID');
    }

    return this.usersRepository.findOneBy({ shopifyGID });
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    const matchedUser = await this.usersRepository.findOneBy({ id });
    if (!matchedUser) {
      throw new NotFoundException();
    }

    return matchedUser || null;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException();
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOneBy({
        email: updateUserDto.email,
      });

      if (existingUser && existingUser.id !== user.id) {
        throw new ConflictException('Email already exists');
      }
    }

    const hashedPassword = updateUserDto.password
      ? await bcrypt.hash(updateUserDto.password, SALT_ROUNDS)
      : undefined;

    this.usersRepository.merge(user, {
      ...updateUserDto,
      ...(hashedPassword ? { password: hashedPassword } : {}),
    });

    return this.usersRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException();
    }

    await this.usersRepository.delete({ id });
    return { id };
  }

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
    const existingUser = await this.findByShopifyGID(userGID);

    if (!existingUser) {
      const user = await this.findByEmail(body.email);

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
        const updatedUser = await this.update(userToUpd.id, updates);

        if (updatedUser) {
          this.logger.info(
            `User with ID ${updatedUser.id} (${updatedUser.firstName} ${updatedUser.lastName ?? ''}) was successfully updated.`,
          );
        }
      }
    } else {
      const createdUser = await this.create({
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
}
