export type TipoEstado = 'GENERAL' | 'CONVOCATORIA' | 'POSTULACION';

export interface Estado {
  id: number;
  nombre: string;
  tipo: TipoEstado;
}
