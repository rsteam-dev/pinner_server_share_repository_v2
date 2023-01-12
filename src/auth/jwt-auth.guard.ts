import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private AuthService: AuthService) {
    super();
  }

  /**
   * 토큰 검증 -> 완료 -> rt재저장 -> tk rt 리턴
   */
  async canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    // super.logIn(context)
    const request = context.switchToHttp().getRequest();
    // console.log(super.canActivate(context))
    console.log('canActivate');
    const tk = request['headers']?.['authorization'];

    const result = await this.AuthService.validateUser(tk);

    if (!result) return false;

    return true;
    /**
        {
          "statusCode": 403,
          "message": "Forbidden resource",
          "error": "Forbidden"
        }
     */
    // return super.canActivate(context);
  }

  //* if global jwt app.module
  // canActivate(context: ExecutionContext) {
  //   const isPublic = this.reflector.getAllAndOverride<boolean>(
  //     process.env.IS_PUBLIC_KEY,
  //     [context.getHandler(), context.getClass()],
  //   );
  //   if (isPublic) {
  //     return true;
  //   }
  //   return super.canActivate(context);
  // }

  handleRequest(err, user, info) {
    console.log('handleRequest');
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
