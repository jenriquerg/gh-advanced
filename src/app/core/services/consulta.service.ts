import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Consulta {
  id: number;
  id_consultorio: number;
  id_medico: number;
  id_paciente: number;
  tipo: string;
  horario: string;
  diagnostico: string;
  costo: number | null;

}

@Injectable({ providedIn: 'root' })
export class ConsultaService {
  private baseUrl = 'http://127.0.0.1:3000/consultas';

  constructor(private http: HttpClient) {}

  getConsultasPaciente(idPaciente: number): Observable<Consulta[]> {
    return this.http
      .get<{ data: Consulta[] }>(`${this.baseUrl}/paciente/${idPaciente}`)
      .pipe(map(res => res.data));
  }

  crearConsulta(payload: Omit<Consulta, 'id'>): Observable<Consulta> {
    return this.http
      .post<{ data: Consulta[] }>(this.baseUrl, payload)
      .pipe(map(res => res.data[0]));
  }

   getConsultasMedico(idMedico: number): Observable<Consulta[]> {
    return this.http
    .get<{ data: Consulta[] }>(`${this.baseUrl}/medico/${idMedico}`)
      .pipe(map(res => res.data));
  }

  updateConsulta(id: number, payload: Partial<Consulta>): Observable<Consulta> {
  return this.http
    .put<{ data: Consulta }>(`${this.baseUrl}/${id}`, payload)
    .pipe(map(res => res.data));
}


}
