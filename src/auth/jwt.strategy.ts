import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JWTPayload } from './auth.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // Configura o jwt
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  // Extrai informação do payload
  async validate({ userId, email }: JWTPayload) {
    return { userId, email };
  }
}
