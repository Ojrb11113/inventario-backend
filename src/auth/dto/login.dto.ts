import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Username', example: 'ojrb11113' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'User password', example: 'orlandito123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
