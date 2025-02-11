import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe
} from '@nestjs/common';
import { EntriesService } from './entries.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { roles } from '@prisma/client';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('entries')
export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

  @Auth(roles.administrador)
  @Post()
  create(
    @Body() createEntryDto: CreateEntryDto,
    @GetUser('id') userId: number
  ) {
    return this.entriesService.create(createEntryDto, userId);
  }

  @Auth(roles.administrador)
  @Get(':productId')
  findAllEntryProduct(@Param('productId', ParseIntPipe) productId: string) {
    return this.entriesService.findAllEntryProduct(+productId);
  }
}
