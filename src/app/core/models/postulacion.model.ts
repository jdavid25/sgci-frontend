export interface Postulacion {
  id: number;
  convocatoriaId: number;
  convocatoriaNombre: string;
  usuarioId: number;
  usuarioNombre: string;
  estadoId: number;
  estadoNombre: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostulacionCreateRequest {
  convocatoriaId: number;
}

export interface PostulacionEstadoRequest {
  estadoId: number;
}
