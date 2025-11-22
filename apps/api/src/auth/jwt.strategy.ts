import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import * as JwksRsa from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
  sub: string;
  email?: string;
  [key: string]: unknown;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private configService: ConfigService;

  constructor(configService: ConfigService) {
    const auth0Domain = configService.get<string>('AUTH0_DOMAIN');
    const auth0Audience = configService.get<string>('AUTH0_AUDIENCE');

    if (auth0Domain && auth0Audience) {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        audience: auth0Audience,
        issuer: `https://${auth0Domain}/`,
        algorithms: ['RS256'],
        secretOrKeyProvider: JwksRsa.passportJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `https://${auth0Domain}/.well-known/jwks.json`,
        }),
      });
    } else {
      console.warn(
        'AUTH0_DOMAIN or AUTH0_AUDIENCE is not set. JWT Strategy will not be configured properly.',
      );
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: 'book_secret',
      });
    }

    // Assign services after super() call
    this.configService = configService;
  }

  validate(payload: JwtPayload) {
    // This gets called after successful token validation
    const auth0Domain = this.configService.get<string>('AUTH0_DOMAIN');
    const auth0Audience = this.configService.get<string>('AUTH0_AUDIENCE');

    // if Auth0 configured, validate token properly
    if (auth0Domain && auth0Audience) {
      if (!payload.sub) {
        throw new Error('Invalid token structure: missing sub claim');
      }
    }

    return {
      payload,
    };
  }
}
