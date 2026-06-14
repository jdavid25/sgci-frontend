export type TipoEstado = 'CONVOCATORIA' | 'POSTULACION';

export interface Estado {
  id: number;
  nombre: string;
  tipo: TipoEstado;
}
