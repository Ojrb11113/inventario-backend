import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { usuario } from '@prisma/client';
import { Observable } from 'rxjs';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles: string[] = this.reflector.get('roles', context.getHandler());

    if (!roles || roles.length === 0) {
      return true;
    }

    const user = this.getUserFromRequest(context);
    return this.validateUserRol(user, roles);
  }

  getUserFromRequest(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const user: usuario = req.user;
    return user;
  }

  validateUserRol(user: usuario, roles: string[]) {
    if (!user) throw new BadRequestException('user not found');

    if (roles.includes(user.rol || '')) {
      return true;
    }

    throw new ForbiddenException(
      `the user ${user.name} need a valid role (${roles})`
    );
  }
}
