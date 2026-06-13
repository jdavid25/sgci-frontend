import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Postulacion } from '../core/models/postulacion.model';
import { PostulacionService } from '../core/services/postulacion.service';

@Component({
  selector: 'app-mis-postulaciones',
  imports: [CommonModule],
  templateUrl: './mis-postulaciones.component.html',
  styleUrl: './mis-postulaciones.component.scss'
})
export class MisPostulacionesComponent {
  private readonly postulacionService = inject(PostulacionService);

  readonly postulaciones = signal<Postulacion[]>([]);
  readonly cargando = signal(false);
  readonly mensajeError = signal('');

  constructor() {
    this.cargarPostulaciones();
  }

  cargarPostulaciones(): void {
    this.cargando.set(true);
    this.mensajeError.set('');

    this.postulacionService.listarMisPostulaciones().subscribe({
      next: (postulaciones) => {
        this.postulaciones.set(postulaciones);
        this.cargando.set(false);
      },
      error: (error) => {
        this.mensajeError.set(error.error?.message ?? 'No fue posible cargar sus postulaciones.');
        this.cargando.set(false);
      }
    });
  }

  badgeEstado(estadoNombre: string): string {
    if (estadoNombre === 'APROBADA') {
      return 'text-bg-success';
    }

    if (estadoNombre === 'RECHAZADA') {
      return 'text-bg-danger';
    }

    return 'text-bg-warning';
  }
}
