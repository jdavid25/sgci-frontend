import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Estado, TipoEstado } from '../models/estado.model';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {
  private readonly url = `${environment.apiUrl}/estados`;

  constructor(private readonly http: HttpClient) {}

  listarPorTipo(tipo: TipoEstado): Observable<Estado[]> {
    return this.http.get<Estado[]>(this.url, {
      params: { tipo }
    });
  }
}
