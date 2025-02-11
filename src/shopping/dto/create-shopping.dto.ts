import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  ValidateNested
} from 'class-validator';

export class createShoppingProductDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class CreateShoppingDto {
  @IsNotEmpty()
  @IsNumber()
  exchangeRate: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => createShoppingProductDto)
  products: createShoppingProductDto[];
}
