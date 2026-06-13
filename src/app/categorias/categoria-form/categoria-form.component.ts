import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Categoria, CategoriaRequest } from '../../core/models/categoria.model';
import { CategoriaService } from '../../core/services/categoria.service';

@Component({
  selector: 'app-categoria-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categoria-form.component.html',
  styleUrl: './categoria-form.component.scss'
})
export class CategoriaFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly categoriaService = inject(CategoriaService);

  readonly categoria = input<Categoria | null>(null);
  readonly guardando = signal(false);
  readonly mensajeError = signal('');

  readonly guardado = output<string>();
  readonly cancelar = output<void>();

  readonly form = this.formBuilder.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]]
  });

  constructor() {
    effect(() => {
      const categoria = this.categoria();

      this.form.reset({
        nombre: categoria?.nombre ?? ''
      });
    });
  }

  get esEdicion(): boolean {
    return Boolean(this.categoria());
  }

  enviar(): void {
    this.mensajeError.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    const request: CategoriaRequest = {
      nombre: formValue.nombre
    };

    const categoria = this.categoria();
    const peticion = categoria
      ? this.categoriaService.actualizar(categoria.id, request)
      : this.categoriaService.crear(request);

    this.guardando.set(true);

    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.guardado.emit(categoria ? 'Categoria actualizada correctamente.' : 'Categoria creada correctamente.');
      },
      error: (error) => {
        this.guardando.set(false);
        this.mensajeError.set(error.error?.message ?? 'No fue posible guardar la categoria.');
      }
    });
  }
}
