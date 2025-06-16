import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const userRole = req.headers['role'];
    if (userRole !== 'admin') {
      throw new ForbiddenException('Admins only');
    }
    return true;
  }
}
