import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { dashboardRoutes } from './dashboard/dashboard.routes';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (c) => c.DashboardComponent
      ),
    children: dashboardRoutes,
  },
  {
    path: '**',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
