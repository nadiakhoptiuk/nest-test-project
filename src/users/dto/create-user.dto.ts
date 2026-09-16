import {
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

  @IsString()
  @Length(1, 255)
  shopifyGID?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @Length(8, 255)
  @IsNotEmpty()
  password: string;
}
