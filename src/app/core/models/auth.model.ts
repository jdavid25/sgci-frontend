export type RolNombre = 'ADMINISTRADOR' | 'DOCENTE' | 'ESTUDIANTE';

export interface LoginRequest {
  nombreUsuario: string;
  clave: string;
}

export interface LoginResponse {
  token: string;
  usuarioId: number;
  nombre: string;
  rol: RolNombre;
}

export interface UsuarioSesion {
  id: number;
  nombre: string;
  rol: RolNombre;
}
