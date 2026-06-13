import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Categoria } from '../core/models/categoria.model';
import { CategoriaService } from '../core/services/categoria.service';
import { CategoriaFormComponent } from './categoria-form/categoria-form.component';

@Component({
  selector: 'app-categorias',
  imports: [CommonModule, CategoriaFormComponent],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss'
})
export class CategoriasComponent {
  private readonly categoriaService = inject(CategoriaService);

  readonly categorias = signal<Categoria[]>([]);
  readonly cargando = signal(false);
  readonly eliminandoId = signal<number | null>(null);
  readonly mostrandoFormulario = signal(false);
  readonly categoriaSeleccionada = signal<Categoria | null>(null);
  readonly mensajeError = signal('');
  readonly mensajeExito = signal('');

  constructor() {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.cargando.set(true);
    this.mensajeError.set('');

    this.categoriaService.listar().subscribe({
      next: (categorias) => {
        this.categorias.set(categorias);
        this.cargando.set(false);
      },
      error: (error) => {
        this.mensajeError.set(error.error?.message ?? 'No fue posible cargar las categorias.');
        this.cargando.set(false);
      }
    });
  }

  mostrarFormulario(): void {
    this.categoriaSeleccionada.set(null);
    this.mostrandoFormulario.set(true);
    this.mensajeError.set('');
    this.mensajeExito.set('');
  }

  editarCategoria(categoria: Categoria): void {
    this.categoriaSeleccionada.set(categoria);
    this.mostrandoFormulario.set(true);
    this.mensajeError.set('');
    this.mensajeExito.set('');
  }

  cancelarFormulario(): void {
    this.mostrandoFormulario.set(false);
    this.categoriaSeleccionada.set(null);
  }

  categoriaGuardada(mensaje: string): void {
    this.mensajeExito.set(mensaje);
    this.cancelarFormulario();
    this.cargarCategorias();
  }

  eliminarCategoria(categoria: Categoria): void {
    const confirmado = confirm(`Desea eliminar la categoria ${categoria.nombre}?`);
    if (!confirmado) {
      return;
    }

    this.mensajeError.set('');
    this.mensajeExito.set('');
    this.eliminandoId.set(categoria.id);

    this.categoriaService.eliminar(categoria.id).subscribe({
      next: () => {
        this.eliminandoId.set(null);
        this.mensajeExito.set('Categoria eliminada correctamente.');
        this.cargarCategorias();
      },
      error: (error) => {
        this.eliminandoId.set(null);
        this.mensajeError.set(error.error?.message ?? 'No fue posible eliminar la categoria.');
      }
    });
  }
}
