import { HttpException, HttpStatus } from '@nestjs/common';

export class NotModifiedError extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_MODIFIED);
  }
}
