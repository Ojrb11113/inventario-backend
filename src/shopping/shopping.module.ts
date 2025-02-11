import { Module } from '@nestjs/common';
import { ShoppingService } from './shopping.service';
import { ShoppingController } from './shopping.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsModule } from '../products/products.module';
import { ProvidersModule } from 'src/providers/providers.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ShoppingController],
  providers: [ShoppingService],
  imports: [PrismaModule, ProductsModule, ProvidersModule, AuthModule]
})
export class ShoppingModule {}
