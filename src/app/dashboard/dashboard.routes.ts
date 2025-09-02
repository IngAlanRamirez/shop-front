import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products',
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./products/products.component').then((c) => c.ProductsComponent),
  },
  {
    path: 'sales',
    loadComponent: () =>
      import('./sales/sales.component').then((c) => c.SalesComponent),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./users/users.component').then((c) => c.UsersComponent),
  },
];
