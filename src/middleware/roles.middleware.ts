import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const userRole = req.headers['role'];
    if (userRole !== 'admin') {
      throw new ForbiddenException('Admins only');
    }
    return true;
  }
}
