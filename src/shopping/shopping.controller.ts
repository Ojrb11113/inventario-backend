import { Controller, Post, Body } from '@nestjs/common';
import { ShoppingService } from './shopping.service';
import { CreateShoppingDto } from './dto/create-shopping.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('shopping')
export class ShoppingController {
  constructor(private readonly shoppingService: ShoppingService) {}

  @Post()
  @Auth()
  create(
    @Body() createShoppingDto: CreateShoppingDto,
    @GetUser('id') userId: number
  ) {
    return this.shoppingService.create(createShoppingDto, userId);
  }
}
