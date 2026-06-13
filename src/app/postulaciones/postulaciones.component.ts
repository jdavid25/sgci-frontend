import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Estado } from '../core/models/estado.model';
import { Postulacion } from '../core/models/postulacion.model';
import { EstadoService } from '../core/services/estado.service';
import { PostulacionService } from '../core/services/postulacion.service';

@Component({
  selector: 'app-postulaciones',
  imports: [CommonModule],
  templateUrl: './postulaciones.component.html',
  styleUrl: './postulaciones.component.scss'
})
export class PostulacionesComponent {
  private readonly postulacionService = inject(PostulacionService);
  private readonly estadoService = inject(EstadoService);

  readonly postulaciones = signal<Postulacion[]>([]);
  readonly estados = signal<Estado[]>([]);
  readonly cargando = signal(false);
  readonly cambiandoId = signal<number | null>(null);
  readonly cambiandoEstado = signal('');
  readonly mensajeError = signal('');
  readonly mensajeExito = signal('');

  constructor() {
    this.cargarPostulaciones();
    this.cargarEstados();
  }

  cargarPostulaciones(): void {
    this.cargando.set(true);
    this.mensajeError.set('');

    this.postulacionService.listar().subscribe({
      next: (postulaciones) => {
        this.postulaciones.set(postulaciones);
        this.cargando.set(false);
      },
      error: (error) => {
        this.mensajeError.set(error.error?.message ?? 'No fue posible cargar las postulaciones.');
        this.cargando.set(false);
      }
    });
  }

  cambiarEstado(postulacion: Postulacion, estadoNombre: string): void {
    const estado = this.estados().find((item) => item.nombre === estadoNombre);
    if (!estado) {
      this.mensajeError.set(`Estado ${estadoNombre} no encontrado.`);
      return;
    }

    this.mensajeError.set('');
    this.mensajeExito.set('');
    this.cambiandoId.set(postulacion.id);
    this.cambiandoEstado.set(estadoNombre);

    this.postulacionService.cambiarEstado(postulacion.id, { estadoId: estado.id }).subscribe({
      next: (postulacionActualizada) => {
        this.cambiandoId.set(null);
        this.cambiandoEstado.set('');
        this.mensajeExito.set('Estado de postulacion actualizado correctamente.');
        this.postulaciones.update((postulaciones) =>
          postulaciones.map((item) => item.id === postulacionActualizada.id ? postulacionActualizada : item)
        );
      },
      error: (error) => {
        this.cambiandoId.set(null);
        this.cambiandoEstado.set('');
        this.mensajeError.set(error.error?.message ?? 'No fue posible actualizar la postulacion.');
      }
    });
  }

  puedeCambiar(postulacion: Postulacion, estadoNombre: string): boolean {
    return postulacion.estadoNombre !== estadoNombre && this.cambiandoId() !== postulacion.id;
  }

  estaCambiando(postulacion: Postulacion, estadoNombre: string): boolean {
    return this.cambiandoId() === postulacion.id && this.cambiandoEstado() === estadoNombre;
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

  private cargarEstados(): void {
    this.estadoService.listarPorTipo('POSTULACION').subscribe({
      next: (estados) => this.estados.set(estados),
      error: (error) => this.mensajeError.set(error.error?.message ?? 'No fue posible cargar los estados.')
    });
  }
}
