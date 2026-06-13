import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, RolNombre, UsuarioSesion } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'sgci_token';
  private readonly usuarioKey = 'sgci_usuario';

  constructor(private readonly http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, request)
      .pipe(
        tap((response) => this.guardarSesion(response))
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usuarioKey);
  }

  estaAutenticado(): boolean {
    return Boolean(this.obtenerToken());
  }

  obtenerToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  obtenerUsuario(): UsuarioSesion | null {
    const usuarioGuardado = localStorage.getItem(this.usuarioKey);
    return usuarioGuardado ? JSON.parse(usuarioGuardado) as UsuarioSesion : null;
  }

  tieneRol(rolesPermitidos: RolNombre[]): boolean {
    const usuario = this.obtenerUsuario();
    return usuario ? rolesPermitidos.includes(usuario.rol) : false;
  }

  private guardarSesion(response: LoginResponse): void {
    const usuario: UsuarioSesion = {
      id: response.usuarioId,
      nombre: response.nombre,
      rol: response.rol
    };

    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.usuarioKey, JSON.stringify(usuario));
  }
}
