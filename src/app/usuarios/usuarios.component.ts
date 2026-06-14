import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Rol } from '../core/models/rol.model';
import { Usuario } from '../core/models/usuario.model';
import { RolService } from '../core/services/rol.service';
import { UsuarioService } from '../core/services/usuario.service';
import { UsuarioFormComponent } from './usuario-form/usuario-form.component';

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, UsuarioFormComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent {
  private readonly usuarioService = inject(UsuarioService);
  private readonly rolService = inject(RolService);

  readonly usuarios = signal<Usuario[]>([]);
  readonly roles = signal<Rol[]>([]);
  readonly cargando = signal(false);
  readonly eliminandoId = signal<number | null>(null);
  readonly mostrandoFormulario = signal(false);
  readonly usuarioSeleccionado = signal<Usuario | null>(null);
  readonly mensajeError = signal('');
  readonly mensajeExito = signal('');

  constructor() {
    this.cargarUsuarios();
    this.cargarCatalogos();
  }

  cargarUsuarios(): void {
    this.cargando.set(true);
    this.mensajeError.set('');

    this.usuarioService.listar().subscribe({
      next: (usuarios) => {
        this.usuarios.set(usuarios);
        this.cargando.set(false);
      },
      error: (error) => {
        this.mensajeError.set(error.error?.message ?? 'No fue posible cargar los usuarios.');
        this.cargando.set(false);
      }
    });
  }

  mostrarFormulario(): void {
    this.usuarioSeleccionado.set(null);
    this.mostrandoFormulario.set(true);
    this.mensajeError.set('');
    this.mensajeExito.set('');
  }

  editarUsuario(usuario: Usuario): void {
    this.usuarioSeleccionado.set(usuario);
    this.mostrandoFormulario.set(true);
    this.mensajeError.set('');
    this.mensajeExito.set('');
  }

  cancelarFormulario(): void {
    this.mostrandoFormulario.set(false);
    this.usuarioSeleccionado.set(null);
  }

  usuarioGuardado(mensaje: string): void {
    this.mensajeExito.set(mensaje);
    this.cancelarFormulario();
    this.cargarUsuarios();
  }

  eliminarUsuario(usuario: Usuario): void {
    const confirmado = confirm(`Desea eliminar el usuario ${usuario.nombre}?`);
    if (!confirmado) {
      return;
    }

    this.mensajeError.set('');
    this.mensajeExito.set('');
    this.eliminandoId.set(usuario.id);

    this.usuarioService.eliminar(usuario.id).subscribe({
      next: () => {
        this.eliminandoId.set(null);
        this.mensajeExito.set('Usuario eliminado correctamente.');
        this.cargarUsuarios();
      },
      error: (error) => {
        this.eliminandoId.set(null);
        this.mensajeError.set(error.error?.message ?? 'No fue posible eliminar el usuario.');
      }
    });
  }

  private cargarCatalogos(): void {
    this.rolService.listar().subscribe({
      next: (roles) => this.roles.set(roles),
      error: (error) => this.mensajeError.set(error.error?.message ?? 'No fue posible cargar los roles.')
    });
  }

}
