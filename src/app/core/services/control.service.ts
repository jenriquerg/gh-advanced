import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Control {
  paciente_id: number;
  peso_kg: number;
  altura_cm: number;
  imc: number;
  presion_arterial: string;
  frecuencia_cardiaca: number;
  frecuencia_respiratoria: number;
  temperatura_c: number;
  nivel_glucosa: number;
  saturacion_oxigeno: number;
  notas_generales: string;
  fecha: string;
}

@Injectable({ providedIn: 'root' })
export class ControlService {
  private baseUrl = 'http://127.0.0.1:3000/controles';

  constructor(private http: HttpClient) {}

  crearControl(payload: Control): Observable<any> {
    return this.http.post(this.baseUrl, payload);
  }

  getControlesPaciente(pacienteId: number): Observable<Control[]> {
    return this.http
      .get<{ data: Control[] }>(`${this.baseUrl}/paciente/${pacienteId}`)
      .pipe(map(res => res.data));
  }
}
