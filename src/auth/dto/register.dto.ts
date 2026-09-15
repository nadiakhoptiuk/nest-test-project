import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @Length(1, 255)
  email: string;

  @IsAlphanumeric()
  @Length(0, 8)
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  lastName: string;
}
