import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

interface JwtPayload {
  shop: string;
  source: string;
  iat: number;
  exp: number;
}

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      headers: {
        'x-api-key'?: string;
      };
      shop?: string;
    }>();

    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('API key is required');
    }

    // Check if it's a JWT token (starts with "eyJ")
    if (apiKey.startsWith('eyJ')) {
      return this.verifyJwtToken(apiKey, request);
    }

    // Otherwise, validate as a simple API key
    return this.verifySimpleApiKey(apiKey);
  }

  private verifyJwtToken(token: string, request: { shop?: string }): boolean {
    try {
      const secretApiKey =
        this.configService.getOrThrow<string>('SECRET_API_KEY');

      // Verify and decode the JWT token
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: secretApiKey,
        algorithms: ['HS256'],
      });

      console.log('✅ Verified JWT payload:', payload);

      // Attach shop to request for later use in controllers/services
      request.shop = payload.shop;

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ JWT verification failed:', errorMessage);
      throw new UnauthorizedException('Invalid JWT token');
    }
  }

  private verifySimpleApiKey(apiKey: string): boolean {
    const expectedApiKey = this.configService.getOrThrow<string>('X_API_KEY');

    console.log('expectedApiKey', expectedApiKey);
    console.log('apiKey', apiKey);

    if (apiKey !== expectedApiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
