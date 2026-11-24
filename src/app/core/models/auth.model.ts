export type Role = 'admin' | 'manager' | 'accountant' | 'viewer';

export type Permission =
  | 'dashboard.view'
  | 'expenses.view'
  | 'expenses.create'
  | 'expenses.update'
  | 'expenses.delete'
  | 'categories.view'
  | 'categories.manage'
  | 'reports.view'
  | 'settings.view'
  | 'settings.reset'
  | 'users.view'
  | 'roles.view';

export interface AuthenticatedUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: Role;
}

export interface ManagedUser extends AuthenticatedUser {
  department: string;
  lastActive: string;
}
