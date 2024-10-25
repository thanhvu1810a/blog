import { ERole } from 'src/common/database/types/enum';

export type AuthUser = {
  _id: string;
  email: string;
  name: string;
  role: ERole;
};

export type AuthToken = {
  accessToken: string;
  accessTokenExpiresAt: Date;
  refreshToken?: string;
  refreshTokenExpiresAt?: Date;
  user: Partial<AuthUser>;
};
