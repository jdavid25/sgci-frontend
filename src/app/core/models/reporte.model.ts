export interface ConvocatoriasCategoriaReporte {
  categoriaId: number;
  categoriaNombre: string;
  totalConvocatorias: number;
}

export interface PostulacionesConvocatoriaReporte {
  convocatoriaId: number;
  convocatoriaNombre: string;
  totalPostulaciones: number;
}

export interface ResultadoPostulacionesReporte {
  estadoNombre: string;
  totalPostulaciones: number;
}
