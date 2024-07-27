import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExtendedRequest } from '../middleware/AuthMiddleware';

export const User = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const request: ExtendedRequest = context.switchToHttp().getRequest();
    if (!request.user) {
      return null;
    }

    if (data) {
      return request.user[data];
    }

    return request.user;
  },
);
