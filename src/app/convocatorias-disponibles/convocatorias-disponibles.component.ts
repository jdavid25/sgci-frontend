import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Convocatoria } from '../core/models/convocatoria.model';
import { AuthService } from '../core/services/auth.service';
import { ConvocatoriaService } from '../core/services/convocatoria.service';
import { PostulacionService } from '../core/services/postulacion.service';

@Component({
  selector: 'app-convocatorias-disponibles',
  imports: [CommonModule],
  templateUrl: './convocatorias-disponibles.component.html',
  styleUrl: './convocatorias-disponibles.component.scss'
})
export class ConvocatoriasDisponiblesComponent {
  private readonly convocatoriaService = inject(ConvocatoriaService);
  private readonly postulacionService = inject(PostulacionService);
  private readonly authService = inject(AuthService);

  readonly convocatorias = signal<Convocatoria[]>([]);
  readonly cargando = signal(false);
  readonly postulandoId = signal<number | null>(null);
  readonly postuladasIds = signal<number[]>([]);
  readonly mensajeError = signal('');
  readonly mensajeExito = signal('');
  readonly esEstudiante = this.authService.tieneRol(['ESTUDIANTE']);

  constructor() {
    this.cargarConvocatorias();
  }

  cargarConvocatorias(): void {
    this.cargando.set(true);
    this.mensajeError.set('');

    this.convocatoriaService.listarPublicadas().subscribe({
      next: (convocatorias) => {
        this.convocatorias.set(convocatorias);
        this.cargando.set(false);
      },
      error: (error) => {
        this.mensajeError.set(error.error?.message ?? 'No fue posible cargar las convocatorias disponibles.');
        this.cargando.set(false);
      }
    });
  }

  postularse(convocatoria: Convocatoria): void {
    if (this.yaPostulado(convocatoria.id)) {
      return;
    }

    this.mensajeError.set('');
    this.mensajeExito.set('');
    this.postulandoId.set(convocatoria.id);

    this.postulacionService.crear({ convocatoriaId: convocatoria.id }).subscribe({
      next: () => {
        this.postulandoId.set(null);
        this.postuladasIds.update((ids) => [...ids, convocatoria.id]);
        this.mensajeExito.set('Postulacion registrada correctamente.');
      },
      error: (error) => {
        this.postulandoId.set(null);
        this.mensajeError.set(error.error?.message ?? 'No fue posible registrar la postulacion.');
      }
    });
  }

  yaPostulado(convocatoriaId: number): boolean {
    return this.postuladasIds().includes(convocatoriaId);
  }
}
