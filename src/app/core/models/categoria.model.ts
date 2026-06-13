export interface Categoria {
  id: number;
  nombre: string;
  estadoId: number;
  estadoNombre: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriaRequest {
  nombre: string;
}
