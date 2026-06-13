import { RolNombre } from './auth.model';

export interface Rol {
  id: number;
  nombre: RolNombre;
  estadoId: number;
  estadoNombre: string;
}
