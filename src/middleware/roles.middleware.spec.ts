import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RolesGuard } from './roles.middleware';
import { Request } from 'express';

describe('RolesGuard', () => {
  let guard: RolesGuard;

  beforeEach(() => {
    guard = new RolesGuard();
  });

  const mockContext = (role?: string): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: (): Partial<Request> => ({
          headers: {
            role,
          },
        }),
      }),
    }) as unknown as ExecutionContext;

  it('should allow if role is admin', () => {
    expect(guard.canActivate(mockContext('admin'))).toBe(true);
  });

  it('should throw if role is missing or not admin', () => {
    expect(() => guard.canActivate(mockContext('user'))).toThrow(
      ForbiddenException,
    );

    expect(() => guard.canActivate(mockContext(undefined))).toThrow(
      ForbiddenException,
    );
  });
});
