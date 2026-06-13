import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Usuario } from '../core/models/usuario.model';
import { UsuarioService } from '../core/services/usuario.service';

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent {
    private readonly usuarioService = inject(UsuarioService);

    readonly usuarios = signal<Usuario[]>([]);
    readonly cargando = signal(false);
    readonly mensajeError = signal('');

  constructor() {
    this.cargarUsuarios();
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
}
