import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Username', example: 'ojrb11113' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'User password', example: 'orlandito123' })
  @IsString()
  password: string;
}
