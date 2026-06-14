export interface Usuario {
  id: number;
  identificacion: string;
  nombre: string;
  correo: string;
  nombreUsuario: string;
  rolId: number;
  rolNombre: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsuarioRequest {
  identificacion: string;
  nombre: string;
  correo: string;
  nombreUsuario: string;
  clave?: string;
  rolId: number;
}
