
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

import { env } from '../../../configuration/env.service.js';

type AuthRequest = Request & {
  user?: JwtPayload | string;
};

@Injectable()
export class AuthGuardGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request =
      context.switchToHttp().getRequest<AuthRequest>();

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException(
        'Authorization header is missing',
      );
    }

    const [flag, token, ...extra] = authorization.split(' ');

    if (flag !== 'Bearer' || !token || extra.length > 0) {
      throw new UnauthorizedException(
        'Invalid authorization format',
      );
    }

    try {
      // 1. Decode the token without verifying its signature
      const decoded = jwt.decode(token);

      console.log('1. Token decoded:', Boolean(decoded));

      if (!decoded || typeof decoded === 'string') {
        throw new Error('Token cannot be decoded');
      }

      // 2. Check the audience
      console.log('2. Audience:', decoded.aud);

      let signature: string;

      switch (decoded.aud) {
        case 'User':
          signature = env.jwtUserSecret;
          break;

        case 'Admin':
          signature = env.jwtAdminSecret;
          break;

        default:
          throw new Error(
            `Unexpected audience: ${JSON.stringify(decoded.aud)}`,
          );
      }

      if (!signature) {
        throw new Error('JWT secret is missing from configuration');
      }

      // 3. Verify the signature and token expiration
      const decodedData = jwt.verify(
        token,
        signature,
      ) as JwtPayload;

      console.log('3. Token verified successfully');
      console.log('4. Payload has id:', Boolean(decodedData.id));

      // 4. Ensure the token contains a user ID
      if (!decodedData.id) {
        throw new Error('Verified token has no id field');
      }

      // 5. Attach verified payload to the request
      request.user = decodedData;

      return true;
    } catch (error) {
      console.error(
        'AUTH GUARD ERROR:',
        error instanceof Error ? error.message : error,
      );

      throw new UnauthorizedException(
        error instanceof Error
          ? error.message
          : 'Invalid or expired token',
      );
    }
  }
}
