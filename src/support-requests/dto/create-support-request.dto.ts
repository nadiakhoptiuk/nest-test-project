import { IsDateString, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateSupportRequestDto {
  @IsString()
  @Length(1, 255)
  @IsNotEmpty()
  domain: string;

  @IsString()
  @Length(1, 255)
  @IsNotEmpty()
  message: string;

  @IsString()
  @Length(1, 255)
  @IsNotEmpty()
  customerGID: string;

  @IsString()
  @Length(1, 255)
  @IsNotEmpty()
  customerEmail: string;

  @IsString()
  @Length(1, 255)
  @IsNotEmpty()
  customerFullName: string;

  @IsString()
  customerFirstName?: string;

  @IsString()
  customerLastName?: string;

  @IsString()
  @Length(1, 255)
  @IsNotEmpty()
  orderShopifyGID: string;

  @IsDateString()
  @Length(1, 255)
  @IsNotEmpty()
  date: Date;
}
