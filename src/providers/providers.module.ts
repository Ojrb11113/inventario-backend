import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ProvidersController],
  providers: [ProvidersService],
  imports: [AuthModule, PrismaModule]
})
export class ProvidersModule {}
