import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'remitos',
    loadChildren: () =>
      import('./components/remitos/remitos.routes').then(m => m.remitosRoutes)
  }
];
