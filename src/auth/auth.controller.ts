import { Controller, Post, Body, Res, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { Auth } from './decorators/auth.decorator';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { GetUser } from './decorators/get-user.decorator';
import { usuario } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'create an user' })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'login' })
  @ApiBody({ type: LoginDto })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { access_token } = await this.authService.login(loginDto);

    res.cookie('token', access_token, {
      httpOnly: true
    });

    return {
      msg: 'session started successfully'
    };
  }

  @Get('access')
  @Auth()
  access(@GetUser() user: usuario) {
    return {
      id: user.id,
      name: user.name,
      rol: user.rol
    };
  }
}
