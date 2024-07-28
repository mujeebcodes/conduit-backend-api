import { Injectable, NestMiddleware } from '@nestjs/common';
import { User } from '@prisma/client';
import { NextFunction, Request } from 'express';
import { UsersService } from '../users.service';

export interface ExtendedRequest extends Request {
  user?: User;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: ExtendedRequest, _: any, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      return next();
    }

    const token = req.headers.authorization;

    try {
      const decoded = await this.usersService.verifyToken(token);

      const existingUser = await this.usersService.getUserById(decoded.id);

      if (!existingUser) {
        throw new Error();
      }

      req.user = existingUser;
      next();
    } catch (error) {
      console.log(error);
      req.user = null;
      next();
    }
  }
}
