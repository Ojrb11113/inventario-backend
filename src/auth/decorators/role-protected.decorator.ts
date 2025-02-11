import { SetMetadata } from '@nestjs/common';
import { roles } from '@prisma/client';

export const RoleProtected = (...validRoles: roles[]) => {
  return SetMetadata('roles', validRoles);
};
