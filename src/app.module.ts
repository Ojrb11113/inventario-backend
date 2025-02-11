import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { envs } from './config/env.config';
import { joiValidation } from './config/joi.validation';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { EntriesModule } from './entries/entries.module';
import { ProvidersModule } from './providers/providers.module';
import { ShoppingModule } from './shopping/shopping.module';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envs],
      validationSchema: joiValidation
    }),
    CommonModule,
    PrismaModule,
    AuthModule,
    ProductsModule,
    EntriesModule,
    ProvidersModule,
    ShoppingModule,
    EmployeeModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
