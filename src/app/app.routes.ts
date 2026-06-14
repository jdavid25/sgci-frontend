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
        data: { roles: ['ADMINISTRADOR'] },
        loadComponent: () => import('./convocatorias/convocatorias.component').then((m) => m.ConvocatoriasComponent)
      },
      {
        path: 'convocatorias-disponibles',
        canActivate: [roleGuard],
        data: { roles: ['DOCENTE', 'ESTUDIANTE'] },
        loadComponent: () => import('./convocatorias-disponibles/convocatorias-disponibles.component').then((m) => m.ConvocatoriasDisponiblesComponent)
      },
      {
        path: 'postulaciones',
        canActivate: [roleGuard],
        data: { roles: ['ADMINISTRADOR'] },
        loadComponent: () => import('./postulaciones/postulaciones.component').then((m) => m.PostulacionesComponent)
      },
      {
        path: 'mis-postulaciones',
        canActivate: [roleGuard],
        data: { roles: ['ESTUDIANTE'] },
        loadComponent: () => import('./mis-postulaciones/mis-postulaciones.component').then((m) => m.MisPostulacionesComponent)
      },
      {
        path: 'reportes',
        canActivate: [roleGuard],
        data: { roles: ['ADMINISTRADOR'] },
        loadComponent: () => import('./reportes/reportes.component').then((m) => m.ReportesComponent)
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
