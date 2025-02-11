import { Module } from '@nestjs/common';
import { EntriesService } from './entries.service';
import { EntriesController } from './entries.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProvidersModule } from 'src/providers/providers.module';

@Module({
  controllers: [EntriesController],
  providers: [EntriesService],
  imports: [AuthModule, PrismaModule, ProvidersModule]
})
export class EntriesModule {}
