export interface CategoriaConvocatoria {
  id: number;
  nombre: string;
}

export interface Convocatoria {
  id: number;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  cuposDisponibles: number;
  estadoId: number;
  estadoNombre: string;
  categorias: CategoriaConvocatoria[];
  createdAt: string;
  updatedAt: string;
}

export interface ConvocatoriaRequest {
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  cuposDisponibles: number;
  estadoId: number;
  categoriaIds: number[];
}
