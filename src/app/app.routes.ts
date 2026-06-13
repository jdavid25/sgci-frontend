import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { roleGuard } from './core/guards/role.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./auth/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then((m) => m.DashboardComponent)
      },
      {
        path: 'usuarios',
        canActivate: [roleGuard],
        data: { roles: ['ADMINISTRADOR'] },
        loadComponent: () => import('./usuarios/usuarios.component').then((m) => m.UsuariosComponent)
      },
      {
        path: 'categorias',
        canActivate: [roleGuard],
        data: { roles: ['ADMINISTRADOR'] },
        loadComponent: () => import('./categorias/categorias.component').then((m) => m.CategoriasComponent)
      },
      {
        path: 'convocatorias',
        canActivate: [roleGuard],
        data: { roles: ['ADMINISTRADOR', 'DOCENTE', 'ESTUDIANTE'], title: 'Convocatorias' },
        loadComponent: () => import('./shared/placeholder-page/placeholder-page.component').then((m) => m.PlaceholderPageComponent)
      },
      {
        path: 'postulaciones',
        canActivate: [roleGuard],
        data: { roles: ['ADMINISTRADOR', 'ESTUDIANTE'], title: 'Postulaciones' },
        loadComponent: () => import('./shared/placeholder-page/placeholder-page.component').then((m) => m.PlaceholderPageComponent)
      },
      {
        path: 'reportes',
        canActivate: [roleGuard],
        data: { roles: ['ADMINISTRADOR'], title: 'Reportes' },
        loadComponent: () => import('./shared/placeholder-page/placeholder-page.component').then((m) => m.PlaceholderPageComponent)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
