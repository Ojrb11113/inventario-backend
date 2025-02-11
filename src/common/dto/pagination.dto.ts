import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ description: 'record limit', example: 10, required: false })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({ description: 'current page', example: 1, required: false })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page?: number;
}
