import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Postulacion, PostulacionCreateRequest, PostulacionEstadoRequest } from '../models/postulacion.model';

@Injectable({
  providedIn: 'root'
})
export class PostulacionService {
  private readonly url = `${environment.apiUrl}/postulaciones`;

  constructor(private readonly http: HttpClient) {}

  crear(request: PostulacionCreateRequest): Observable<Postulacion> {
    return this.http.post<Postulacion>(this.url, request);
  }

  listar(): Observable<Postulacion[]> {
    return this.http.get<Postulacion[]>(this.url);
  }

  listarMisPostulaciones(): Observable<Postulacion[]> {
    return this.http.get<Postulacion[]>(`${this.url}/mis-postulaciones`);
  }

  cambiarEstado(id: number, request: PostulacionEstadoRequest): Observable<Postulacion> {
    return this.http.put<Postulacion>(`${this.url}/${id}/estado`, request);
  }
}
