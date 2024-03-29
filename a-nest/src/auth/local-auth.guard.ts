import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';


/**
 * Passport.authenticate('local', (authError, user, info)) 이 과정과 같다고 생각하면 됨
 * Guard니까 Middleware 후 Pre-Interceptor 전 과정에 적용됨
 * 
 * LocalAuthGuard실행 후 LocalStrategy가 실행 됨
 * LocalStrategy에서 validate가 done이 되면 serializeUser가 됨 그 serializeUser는 local.serializer에서 만듬
 * serializer가 진행되면 유저를 세션에 저장하는 방식
 */
@Injectable()
export class LocalAuthGuard  extends AuthGuard('local') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const can = await super.canActivate(context);

        if(can) {
            const request = context.switchToHttp().getRequest();
            console.log('login for cookie');
            await super.logIn(request)
        }

        return true
    }
}