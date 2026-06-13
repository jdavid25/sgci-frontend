import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { RolNombre } from '../../core/models/auth.model';
import { AuthService } from '../../core/services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles: RolNombre[];
}

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  readonly menu: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'bi-speedometer2',
      route: '/dashboard',
      roles: ['ADMINISTRADOR', 'DOCENTE', 'ESTUDIANTE']
    },
    {
      label: 'Usuarios',
      icon: 'bi-people',
      route: '/usuarios',
      roles: ['ADMINISTRADOR']
    },
    {
      label: 'Categorias',
      icon: 'bi-tags',
      route: '/categorias',
      roles: ['ADMINISTRADOR']
    },
    {
      label: 'Convocatorias',
      icon: 'bi-megaphone',
      route: '/convocatorias',
      roles: ['ADMINISTRADOR', 'DOCENTE', 'ESTUDIANTE']
    },
    {
      label: 'Postulaciones',
      icon: 'bi-clipboard-check',
      route: '/postulaciones',
      roles: ['ADMINISTRADOR', 'ESTUDIANTE']
    },
    {
      label: 'Reportes',
      icon: 'bi-bar-chart',
      route: '/reportes',
      roles: ['ADMINISTRADOR']
    }
  ];

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  get usuario() {
    return this.authService.obtenerUsuario();
  }

  mostrar(item: MenuItem): boolean {
    return this.authService.tieneRol(item.roles);
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
