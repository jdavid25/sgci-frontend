import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Categoria } from '../core/models/categoria.model';
import { Convocatoria } from '../core/models/convocatoria.model';
import { Estado } from '../core/models/estado.model';
import { CategoriaService } from '../core/services/categoria.service';
import { ConvocatoriaService } from '../core/services/convocatoria.service';
import { EstadoService } from '../core/services/estado.service';
import { ConvocatoriaFormComponent } from './convocatoria-form/convocatoria-form.component';

@Component({
  selector: 'app-convocatorias',
  imports: [CommonModule, ConvocatoriaFormComponent],
  templateUrl: './convocatorias.component.html',
  styleUrl: './convocatorias.component.scss'
})
export class ConvocatoriasComponent {
  private readonly convocatoriaService = inject(ConvocatoriaService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly estadoService = inject(EstadoService);

  readonly convocatorias = signal<Convocatoria[]>([]);
  readonly categorias = signal<Categoria[]>([]);
  readonly estados = signal<Estado[]>([]);
  readonly cargando = signal(false);
  readonly eliminandoId = signal<number | null>(null);
  readonly mostrandoFormulario = signal(false);
  readonly convocatoriaSeleccionada = signal<Convocatoria | null>(null);
  readonly mensajeError = signal('');
  readonly mensajeExito = signal('');

  constructor() {
    this.cargarConvocatorias();
    this.cargarCatalogos();
  }

  cargarConvocatorias(): void {
    this.cargando.set(true);
    this.mensajeError.set('');

    this.convocatoriaService.listar().subscribe({
      next: (convocatorias) => {
        this.convocatorias.set(convocatorias);
        this.cargando.set(false);
      },
      error: (error) => {
        this.mensajeError.set(error.error?.message ?? 'No fue posible cargar las convocatorias.');
        this.cargando.set(false);
      }
    });
  }

  mostrarFormulario(): void {
    this.convocatoriaSeleccionada.set(null);
    this.mostrandoFormulario.set(true);
    this.mensajeError.set('');
    this.mensajeExito.set('');
  }

  editarConvocatoria(convocatoria: Convocatoria): void {
    this.convocatoriaSeleccionada.set(convocatoria);
    this.mostrandoFormulario.set(true);
    this.mensajeError.set('');
    this.mensajeExito.set('');
  }

  cancelarFormulario(): void {
    this.mostrandoFormulario.set(false);
    this.convocatoriaSeleccionada.set(null);
  }

  convocatoriaGuardada(mensaje: string): void {
    this.mensajeExito.set(mensaje);
    this.cancelarFormulario();
    this.cargarConvocatorias();
  }

  eliminarConvocatoria(convocatoria: Convocatoria): void {
    const confirmado = confirm(`Desea eliminar la convocatoria ${convocatoria.nombre}?`);
    if (!confirmado) {
      return;
    }

    this.mensajeError.set('');
    this.mensajeExito.set('');
    this.eliminandoId.set(convocatoria.id);

    this.convocatoriaService.eliminar(convocatoria.id).subscribe({
      next: () => {
        this.eliminandoId.set(null);
        this.mensajeExito.set('Convocatoria eliminada correctamente.');
        this.cargarConvocatorias();
      },
      error: (error) => {
        this.eliminandoId.set(null);
        this.mensajeError.set(error.error?.message ?? 'No fue posible eliminar la convocatoria.');
      }
    });
  }

  private cargarCatalogos(): void {
    this.categoriaService.listar().subscribe({
      next: (categorias) => this.categorias.set(categorias),
      error: (error) => this.mensajeError.set(error.error?.message ?? 'No fue posible cargar las categorias.')
    });

    this.estadoService.listarPorTipo('CONVOCATORIA').subscribe({
      next: (estados) => this.estados.set(estados),
      error: (error) => this.mensajeError.set(error.error?.message ?? 'No fue posible cargar los estados.')
    });
  }
}
