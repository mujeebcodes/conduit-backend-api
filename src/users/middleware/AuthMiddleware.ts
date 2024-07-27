import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { NextFunction, Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

export interface ExtendedRequest extends Request {
  user?: User;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async use(req: ExtendedRequest, _: any, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      return next();
    }

    const token = req.headers.authorization.split(' ')[1];
    try {
      const { email } = await this.jwtService.verify(token);
      const existingUser = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (!existingUser) {
        throw new Error();
      }

      req.user = existingUser;
      next();
    } catch (error) {
      req.user = null;
      next();
    }
  }
}
