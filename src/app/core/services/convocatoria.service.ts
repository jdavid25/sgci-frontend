import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Convocatoria, ConvocatoriaRequest } from '../models/convocatoria.model';

@Injectable({
  providedIn: 'root'
})
export class ConvocatoriaService {
  private readonly url = `${environment.apiUrl}/convocatorias`;

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Convocatoria[]> {
    return this.http.get<Convocatoria[]>(this.url);
  }

  listarPublicadas(): Observable<Convocatoria[]> {
    return this.http.get<Convocatoria[]>(`${this.url}/publicadas`);
  }

  obtenerPorId(id: number): Observable<Convocatoria> {
    return this.http.get<Convocatoria>(`${this.url}/${id}`);
  }

  crear(request: ConvocatoriaRequest): Observable<Convocatoria> {
    return this.http.post<Convocatoria>(this.url, request);
  }

  actualizar(id: number, request: ConvocatoriaRequest): Observable<Convocatoria> {
    return this.http.put<Convocatoria>(`${this.url}/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
