import { ERole } from 'src/enum';

export type AuthPayLoad = {
  iat: number;
  uid: string;
  claims: {
    user_id: string;
    username: string;
  };
};

export type AuthUser = {
  id: string;
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

export type AuthBody = {
  username?: string;
  password?: string;
  access_token?: string;
};