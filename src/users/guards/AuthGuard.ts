import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { ExtendedRequest } from 'src/users/middleware/AuthMiddleware';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request: ExtendedRequest = context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }
}
