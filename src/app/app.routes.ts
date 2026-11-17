import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { LoginComponent } from './features/auth/pages/login/login';

export const routes: Routes = [
  // 1. أول ما يفتح الموقع خالص، يروح على اللوج ان تلقائياً
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 2. مسار صفحة تسجيل الدخول المستقلة
  { path: 'login', component: LoginComponent },

  // 3. تخطيط التطبيق الرئيسي (باقي الصفحات جواها)
  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/pages/dashboard-page/dashboard-page').then(m => m.DashboardPage) },
      { path: 'expenses', loadComponent: () => import('./features/expenses/pages/expense-list-page/expense-list-page').then(m => m.ExpenseListPage) },
      { path: 'categories', loadComponent: () => import('./features/categories/pages/categories-page/categories-page').then(m => m.CategoriesPage) },
      { path: 'reports', loadComponent: () => import('./features/reports/pages/reports-page/reports-page').then(m => m.ReportsPage) },
      { path: 'settings', loadComponent: () => import('./features/settings/pages/settings-page/settings-page').then(m => m.SettingsPage) },
    ]
  },

  { path: '**', redirectTo: 'login' }
];