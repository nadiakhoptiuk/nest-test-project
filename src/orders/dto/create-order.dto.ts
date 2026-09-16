import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsNumber()
  userId?: number | null;

  @IsString()
  orderNumber: string;

  @IsString()
  shopifyGID: string;

  @IsNumber({
    maxDecimalPlaces: 2,
  })
  total: number;

  @IsString()
  currency: string;
}
