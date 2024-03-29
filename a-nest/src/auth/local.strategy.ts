import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

/**
 * Passport.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  // Validate가 되는 순간에 done이 진행되면 done(null, user) => user 부분이 Serialize 유서가 됨
  async validate(email: string, password: string, done: CallableFunction) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();//401과 같은 인증에러
    }
    return done(null, user);
  }
}
