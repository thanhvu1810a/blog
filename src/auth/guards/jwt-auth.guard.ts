import { ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';
import { AuthUser } from '../types/auth.type';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
  ) {
    super();
  }

    canActivate(context: ExecutionContext) {
        // Add your custom authentication logic here
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);
        if (isPublic) {
          return true;
        }
        // for example, call super.logIn(request) to establish a session.
        return super.canActivate(context);
      }
    
      handleRequest<User = AuthUser>(err: Error, user: User): User {
        if (err) {
          throw err;
        } else if (!user) {
          throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
        }
        return user;
      }
}