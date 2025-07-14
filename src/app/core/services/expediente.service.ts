// src/app/services/expediente.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Expediente {
  id: number;
  paciente_id: number;
  antecedentes_personales: string;
  antecedentes_familiares: string;
  alergias: string;
  enfermedades_cronicas: string;
  medicamentos_habituales: string;
  grupo_sanguineo: string;
  vacunas: string;
  notas_generales: string;
  fecha_actualizacion: string;
}

@Injectable({ providedIn: 'root' })
export class ExpedienteService {
  private baseUrl = 'http://127.0.0.1:3000/expedientes';

  constructor(private http: HttpClient) {}

  getExpediente(idPaciente: number): Observable<Expediente> {
    return this.http
      .get<{ data: Expediente[] }>(`${this.baseUrl}/${idPaciente}`)
      .pipe(map(res => res.data[0]));
  }

  // expediente.service.ts
updateExpediente(id: number, payload: Partial<Expediente>): Observable<Expediente> {
  return this.http
    .put<{ data: Expediente }>(`${this.baseUrl}/${id}`, payload)
    .pipe(map(res => res.data));
}

}
