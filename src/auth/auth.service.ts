import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { payloadJWT } from './interface/payloadJWT.interface';
import { LoginDto } from './dto/login.dto';
import { next } from 'src/common/utils/handleError.util';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,

    private readonly jwtService: JwtService
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { username, password } = createUserDto;
      const user = await this.prisma.usuario.findFirst({
        where: {
          name: username
        }
      });

      if (user)
        throw new HttpException(
          `the user ${user.name} already exists in the DB`,
          HttpStatus.BAD_REQUEST
        );

      await this.prisma.usuario.create({
        data: {
          name: username,
          password: bcrypt.hashSync(password, 10),
          rol: 'administrador'
        }
      });

      return {
        msg: 'user created'
      };
    } catch (error) {
      next('Failed to create user', error);
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const { username, password } = loginDto;
      const user = await this.prisma.usuario.findFirst({
        where: {
          name: username
        }
      });

      if (!user)
        throw new HttpException(
          `the user ${username} does not exists in the DB`,
          HttpStatus.NOT_FOUND
        );

      if (!bcrypt.compareSync(password, user.password))
        throw new HttpException(
          `the password is invalid`,
          HttpStatus.BAD_REQUEST
        );

      const { id } = user;

      return {
        access_token: this.generateJWT({ id })
      };
    } catch (error) {
      next('failed to session start', error);
    }
  }

  generateJWT(payload: payloadJWT) {
    return this.jwtService.sign(payload);
  }
}
