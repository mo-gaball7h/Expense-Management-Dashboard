import { AuthenticatedUser } from '../models/auth.model';

export interface DemoAccount extends AuthenticatedUser {
  password: string;
  department: string;
  lastActive: string;
}

export const DEMO_ACCOUNTS: readonly DemoAccount[] = [
  { id: 'user-admin', username: 'admin', password: '123456', name: 'Finance Administrator', email: 'admin@spendwise.com', role: 'admin', department: 'Finance', lastActive: 'Current session' },
  { id: 'user-manager', username: 'manager', password: '123456', name: 'Finance Manager', email: 'manager@spendwise.com', role: 'manager', department: 'Finance', lastActive: 'Demo account' },
  { id: 'user-accountant', username: 'accountant', password: '123456', name: 'Accountant', email: 'accountant@spendwise.com', role: 'accountant', department: 'Accounting', lastActive: 'Demo account' },
  { id: 'user-viewer', username: 'viewer', password: '123456', name: 'Read-only Viewer', email: 'viewer@spendwise.com', role: 'viewer', department: 'Operations', lastActive: 'Demo account' }
];
