import { ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from '../types/auth.type';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {

    handleRequest<User = AuthUser>(err: Error, user: User): User {
        if (err) {
          throw err;
        } else if (!user) {
          throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
        }
        
        return user;
    }
}