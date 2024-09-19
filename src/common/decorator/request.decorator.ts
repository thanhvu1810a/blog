import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { AuthUser } from 'src/auth/types/auth.type';

export const ReqAuthUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request?.user as AuthUser;
  },
);