import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserPayload } from './jwt.strategy';

@Injectable()
export class NormalUserRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserPayload;

    return user.isAthlete === false;
  }
}
