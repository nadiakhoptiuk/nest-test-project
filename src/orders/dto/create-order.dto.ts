import { IsEnum, IsNumber } from 'class-validator';
import { CurrencyEnum } from '../entities/order.entity';

export class CreateOrderDto {
  @IsNumber()
  userId: number;

  @IsNumber({
    maxDecimalPlaces: 2,
  })
  total: number;

  @IsEnum(CurrencyEnum)
  currency: CurrencyEnum;
}
