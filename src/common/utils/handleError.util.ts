import { HttpException, HttpStatus, Logger } from '@nestjs/common';

export const next = (message: string, error: any) => {
  const logger = new Logger('customError');

  if (error instanceof HttpException) {
    logger.error(error);
    throw error;
  } else {
    logger.error(error);
    throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
};
