import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Permission } from '../models/auth.model';
import { PermissionService } from '../services/permission.service';

export const permissionGuard: CanActivateFn = route => {
  const permission = route.data['permission'] as Permission | undefined;
  if (!permission) return true;

  const permissions = inject(PermissionService);
  const router = inject(Router);
  return permissions.has(permission) ? true : router.createUrlTree(['/forbidden']);
};
