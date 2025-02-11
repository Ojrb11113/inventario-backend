import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  ValidateNested
} from 'class-validator';
import { IsValidateDate } from '../decorators/is-validate-date.decorator';

export class ProductsEntryDto {
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @IsPositive()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @IsPositive()
  quantity: number;

  @IsNotEmpty()
  @IsDate()
  @IsValidateDate()
  @Type(() => Date)
  expirationDate: Date;
}

export class CreateEntryDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductsEntryDto)
  products: ProductsEntryDto[];
}
