import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Estado } from '../../core/models/estado.model';
import { Rol } from '../../core/models/rol.model';
import { Usuario, UsuarioRequest } from '../../core/models/usuario.model';
import { UsuarioService } from '../../core/services/usuario.service';

@Component({
  selector: 'app-usuario-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.scss'
})
export class UsuarioFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly usuarioService = inject(UsuarioService);

  readonly usuario = input<Usuario | null>(null);
  readonly roles = input<Rol[]>([]);
  readonly estados = input<Estado[]>([]);
  readonly guardando = signal(false);
  readonly mensajeError = signal('');

  readonly guardado = output<string>();
  readonly cancelar = output<void>();

  readonly form = this.formBuilder.nonNullable.group({
    identificacion: ['', [Validators.required, Validators.maxLength(30)]],
    nombre: ['', [Validators.required, Validators.maxLength(150)]],
    correo: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    nombreUsuario: ['', [Validators.required, Validators.maxLength(80)]],
    clave: ['', [Validators.minLength(8), Validators.maxLength(100)]],
    rolId: [0, [Validators.required, Validators.min(1)]],
    estadoId: [0, [Validators.required, Validators.min(1)]]
  });

  constructor() {
    effect(() => {
      const usuario = this.usuario();

      this.form.reset({
        identificacion: usuario?.identificacion ?? '',
        nombre: usuario?.nombre ?? '',
        correo: usuario?.correo ?? '',
        nombreUsuario: usuario?.nombreUsuario ?? '',
        clave: '',
        rolId: usuario?.rolId ?? 0,
        estadoId: usuario?.estadoId ?? 0
      });

      this.actualizarValidadorClave(Boolean(usuario));
    });
  }

  get esEdicion(): boolean {
    return Boolean(this.usuario());
  }

  enviar(): void {
    this.mensajeError.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    const request: UsuarioRequest = {
      identificacion: formValue.identificacion,
      nombre: formValue.nombre,
      correo: formValue.correo,
      nombreUsuario: formValue.nombreUsuario,
      rolId: formValue.rolId,
      estadoId: formValue.estadoId
    };

    if (formValue.clave) {
      request.clave = formValue.clave;
    }

    const usuario = this.usuario();
    const peticion = usuario
      ? this.usuarioService.actualizar(usuario.id, request)
      : this.usuarioService.crear(request);

    this.guardando.set(true);

    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.guardado.emit(usuario ? 'Usuario actualizado correctamente.' : 'Usuario creado correctamente.');
      },
      error: (error) => {
        this.guardando.set(false);
        this.mensajeError.set(error.error?.message ?? 'No fue posible guardar el usuario.');
      }
    });
  }

  private actualizarValidadorClave(esEdicion: boolean): void {
    const clave = this.form.controls.clave;
    const validators = esEdicion
      ? [Validators.minLength(8), Validators.maxLength(100)]
      : [Validators.required, Validators.minLength(8), Validators.maxLength(100)];

    clave.setValidators(validators);
    clave.updateValueAndValidity({ emitEvent: false });
  }
}
