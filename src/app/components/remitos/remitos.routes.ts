import { Routes } from '@angular/router';

export const remitosRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./remitos-main.component').then(m => m.RemitosMainComponent),
    children: [
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full'
      },
      {
        path: 'main',
        loadComponent: () =>
          import('./remitos.component').then(m => m.RemitosComponent)
      }
    ]
  }
];
