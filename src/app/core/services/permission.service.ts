import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Permission, Role } from '../models/auth.model';

export interface PermissionInfo {
  key: Permission;
  label: string;
  description: string;
  group: string;
}

export interface RoleInfo {
  key: Role;
  label: string;
  description: string;
  permissions: readonly Permission[];
}

const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  admin: [
    'dashboard.view', 'expenses.view', 'expenses.create', 'expenses.update', 'expenses.delete',
    'categories.view', 'categories.manage', 'reports.view', 'settings.view', 'settings.reset',
    'users.view', 'roles.view'
  ],
  manager: [
    'dashboard.view', 'expenses.view', 'expenses.create', 'expenses.update', 'expenses.delete',
    'categories.view', 'reports.view', 'settings.view', 'users.view', 'roles.view'
  ],
  accountant: [
    'dashboard.view', 'expenses.view', 'expenses.create', 'expenses.update',
    'categories.view', 'reports.view'
  ],
  viewer: ['dashboard.view', 'expenses.view', 'categories.view', 'reports.view']
};

const ROLE_METADATA: Omit<RoleInfo, 'permissions'>[] = [
  { key: 'admin', label: 'Administrator', description: 'Full access to workspace records, users and role visibility.' },
  { key: 'manager', label: 'Finance Manager', description: 'Manages expenses and can review users and role permissions.' },
  { key: 'accountant', label: 'Accountant', description: 'Records and updates expenses without deleting them.' },
  { key: 'viewer', label: 'Read-only Viewer', description: 'Can review dashboards, expenses, categories and reports.' }
];

export const PERMISSION_CATALOG: readonly PermissionInfo[] = [
  { key: 'dashboard.view', label: 'View dashboard', description: 'Open totals, trends and recent expenses.', group: 'Workspace' },
  { key: 'expenses.view', label: 'View expenses', description: 'Search, filter and inspect expense records.', group: 'Expenses' },
  { key: 'expenses.create', label: 'Add expenses', description: 'Create new expense records.', group: 'Expenses' },
  { key: 'expenses.update', label: 'Edit expenses', description: 'Change existing expense records.', group: 'Expenses' },
  { key: 'expenses.delete', label: 'Delete expenses', description: 'Permanently remove expense records.', group: 'Expenses' },
  { key: 'categories.view', label: 'View categories', description: 'Review expense categories and their totals.', group: 'Categories' },
  { key: 'categories.manage', label: 'Manage categories', description: 'Create, change or archive categories.', group: 'Categories' },
  { key: 'reports.view', label: 'View reports', description: 'Open company expense reports.', group: 'Workspace' },
  { key: 'settings.view', label: 'View settings', description: 'Open workspace settings.', group: 'Workspace' },
  { key: 'settings.reset', label: 'Reset demo data', description: 'Restore the original sample expense records.', group: 'Workspace' },
  { key: 'users.view', label: 'View users', description: 'Open the workspace user directory.', group: 'Access control' },
  { key: 'roles.view', label: 'View roles & permissions', description: 'Review role descriptions and permission assignments.', group: 'Access control' }
];

@Injectable({ providedIn: 'root' })
export class PermissionService {
  constructor(private auth: AuthService) {}

  has(permission: Permission): boolean {
    const role = this.auth.currentUser?.role;
    return !!role && ROLE_PERMISSIONS[role].includes(permission);
  }

  hasAny(permissions: readonly Permission[]): boolean {
    return permissions.some(permission => this.has(permission));
  }

  hasAll(permissions: readonly Permission[]): boolean {
    return permissions.every(permission => this.has(permission));
  }

  getRoles(): RoleInfo[] {
    return ROLE_METADATA.map(role => ({ ...role, permissions: ROLE_PERMISSIONS[role.key] }));
  }
}
