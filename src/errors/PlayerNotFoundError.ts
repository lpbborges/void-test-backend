import { HttpException, HttpStatus } from '@nestjs/common';

export class PlayerNotFoundError extends HttpException {
  constructor() {
    super('Player not found', HttpStatus.NOT_FOUND);
  }
}
