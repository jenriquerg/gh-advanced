import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NuevaReceta {
  id_consulta: number;
  fecha: string;
  id_medico: number;
  medicamento: string;
  dosis: string;
}

@Injectable({
  providedIn: 'root',
})
export class RecetaService {
  private apiUrl = 'http://127.0.0.1:3000/recetas';

  constructor(private http: HttpClient) {}

  createReceta(receta: NuevaReceta): Observable<any> {
    return this.http.post(this.apiUrl, receta);
  }
}
