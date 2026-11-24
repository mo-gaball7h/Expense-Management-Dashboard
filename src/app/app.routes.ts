import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { LoginComponent } from './features/auth/pages/login/login';
import { ForbiddenPage } from './features/auth/pages/forbidden/forbidden';
import { authGuard } from './core/guards/auth-guard';
import { permissionGuard } from './core/guards/permission-guard';

export const routes: Routes = [
  // 1. أول ما يفتح الموقع خالص، يروح على اللوج ان تلقائياً
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 2. مسار صفحة تسجيل الدخول المستقلة
  { path: 'login', component: LoginComponent },
  { path: 'forbidden', component: ForbiddenPage },

  // 3. تخطيط التطبيق الرئيسي (باقي الصفحات جواها)
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', canActivate: [permissionGuard], data: { permission: 'dashboard.view' }, loadComponent: () => import('./features/dashboard/pages/dashboard-page/dashboard-page').then(m => m.DashboardPage) },
      { path: 'expenses', canActivate: [permissionGuard], data: { permission: 'expenses.view' }, loadComponent: () => import('./features/expenses/pages/expense-list-page/expense-list-page').then(m => m.ExpenseListPage) },
      { path: 'categories', canActivate: [permissionGuard], data: { permission: 'categories.view' }, loadComponent: () => import('./features/categories/pages/categories-page/categories-page').then(m => m.CategoriesPage) },
      { path: 'reports', canActivate: [permissionGuard], data: { permission: 'reports.view' }, loadComponent: () => import('./features/reports/pages/reports-page/reports-page').then(m => m.ReportsPage) },
      { path: 'settings', canActivate: [permissionGuard], data: { permission: 'settings.view' }, loadComponent: () => import('./features/settings/pages/settings-page/settings-page').then(m => m.SettingsPage) },
      { path: 'users', canActivate: [permissionGuard], data: { permission: 'users.view' }, loadComponent: () => import('./features/access-control/pages/users-page/users-page').then(m => m.UsersPage) },
      { path: 'roles-permissions', canActivate: [permissionGuard], data: { permission: 'roles.view' }, loadComponent: () => import('./features/access-control/pages/roles-permissions-page/roles-permissions-page').then(m => m.RolesPermissionsPage) },
    ]
  },

  { path: '**', redirectTo: 'login' }
];
