import {
  IsAlphanumeric,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @Length(1, 255)
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @Length(1, 255)
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @Length(1, 255)
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsAlphanumeric()
  @Length(0, 8)
  @IsNotEmpty()
  password: string;
}
