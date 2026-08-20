import { Request } from 'express';

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
}

export class AuthenticatedUser {
  userId: string;
  email: string;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
