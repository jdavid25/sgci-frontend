import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ConvocatoriasCategoriaReporte,
  PostulacionesConvocatoriaReporte,
  ResultadoPostulacionesReporte
} from '../models/reporte.model';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private readonly url = `${environment.apiUrl}/reportes`;

  constructor(private readonly http: HttpClient) {}

  convocatoriasPorCategoria(): Observable<ConvocatoriasCategoriaReporte[]> {
    return this.http.get<ConvocatoriasCategoriaReporte[]>(`${this.url}/convocatorias-categoria`);
  }

  postulacionesPorConvocatoria(): Observable<PostulacionesConvocatoriaReporte[]> {
    return this.http.get<PostulacionesConvocatoriaReporte[]>(`${this.url}/postulaciones-convocatoria`);
  }

  resultadoPostulaciones(): Observable<ResultadoPostulacionesReporte[]> {
    return this.http.get<ResultadoPostulacionesReporte[]>(`${this.url}/resultado-postulaciones`);
  }
}
