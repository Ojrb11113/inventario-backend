import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) {
      throw new HttpException(
        'user not found (request)',
        HttpStatus.BAD_REQUEST
      );
    }

    return !data ? user : user[data];
  }
);
