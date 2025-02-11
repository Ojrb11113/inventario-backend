import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { jwtFromCookie } from '../utils/jwtFromCookie';
import { Request } from 'express';
import { payloadJWT } from '../interface/payloadJWT.interface';
import { usuario } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,

    private readonly prisma: PrismaService
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_SECRET'),
      jwtFromRequest: (req: Request) => jwtFromCookie(req)
    });
  }

  async validate(payload: payloadJWT): Promise<usuario> {
    const { id } = payload;
    const user = await this.prisma.usuario.findUnique({
      where: {
        id: id
      }
    });

    if (!user) throw new UnauthorizedException(`token is invalid`);

    return user;
  }
}
