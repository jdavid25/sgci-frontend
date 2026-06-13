import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Categoria } from '../../core/models/categoria.model';
import { Convocatoria, ConvocatoriaRequest } from '../../core/models/convocatoria.model';
import { Estado } from '../../core/models/estado.model';
import { ConvocatoriaService } from '../../core/services/convocatoria.service';

@Component({
  selector: 'app-convocatoria-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './convocatoria-form.component.html',
  styleUrl: './convocatoria-form.component.scss'
})
export class ConvocatoriaFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly convocatoriaService = inject(ConvocatoriaService);

  readonly convocatoria = input<Convocatoria | null>(null);
  readonly estados = input<Estado[]>([]);
  readonly categorias = input<Categoria[]>([]);
  readonly guardando = signal(false);
  readonly mensajeError = signal('');

  readonly guardado = output<string>();
  readonly cancelar = output<void>();

  readonly form = this.formBuilder.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(150)]],
    descripcion: ['', [Validators.required]],
    fechaInicio: ['', [Validators.required]],
    fechaFin: ['', [Validators.required]],
    cuposDisponibles: [1, [Validators.required, Validators.min(1)]],
    estadoId: [0, [Validators.required, Validators.min(1)]],
    categoriaIds: this.formBuilder.nonNullable.control<number[]>([], [Validators.required])
  });

  constructor() {
    effect(() => {
      const convocatoria = this.convocatoria();

      this.form.reset({
        nombre: convocatoria?.nombre ?? '',
        descripcion: convocatoria?.descripcion ?? '',
        fechaInicio: convocatoria?.fechaInicio ?? '',
        fechaFin: convocatoria?.fechaFin ?? '',
        cuposDisponibles: convocatoria?.cuposDisponibles ?? 1,
        estadoId: convocatoria?.estadoId ?? 0,
        categoriaIds: convocatoria?.categorias.map((categoria) => categoria.id) ?? []
      });
    });
  }

  get esEdicion(): boolean {
    return Boolean(this.convocatoria());
  }

  enviar(): void {
    this.mensajeError.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();

    if (formValue.fechaFin < formValue.fechaInicio) {
      this.mensajeError.set('La fecha fin debe ser mayor o igual a la fecha inicio.');
      return;
    }

    if (formValue.categoriaIds.length === 0) {
      this.mensajeError.set('Seleccione al menos una categoria.');
      return;
    }

    const request: ConvocatoriaRequest = {
      nombre: formValue.nombre,
      descripcion: formValue.descripcion,
      fechaInicio: formValue.fechaInicio,
      fechaFin: formValue.fechaFin,
      cuposDisponibles: formValue.cuposDisponibles,
      estadoId: formValue.estadoId,
      categoriaIds: formValue.categoriaIds
    };

    const convocatoria = this.convocatoria();
    const peticion = convocatoria
      ? this.convocatoriaService.actualizar(convocatoria.id, request)
      : this.convocatoriaService.crear(request);

    this.guardando.set(true);

    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.guardado.emit(convocatoria ? 'Convocatoria actualizada correctamente.' : 'Convocatoria creada correctamente.');
      },
      error: (error) => {
        this.guardando.set(false);
        this.mensajeError.set(error.error?.message ?? 'No fue posible guardar la convocatoria.');
      }
    });
  }
}
