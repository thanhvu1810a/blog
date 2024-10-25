import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../service/auth.service';
import { AuthUser } from '../types/auth.type';
import { EAuthType } from 'src/common/database/types/enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt',
) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwt.accessSecret'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any): Promise<AuthUser> {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    return await this.authService.verifyToken(
      payload._id,
      token,
      EAuthType.access,
    );
  }
}