import { Request } from 'express';

export const jwtFromCookie = (req: Request) => {
  return req.cookies['token'];
};
