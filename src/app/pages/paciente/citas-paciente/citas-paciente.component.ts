import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ConsultaService } from '../../../core/services/consulta.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-citas-paciente',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    DialogModule,
    ToastModule,
    IftaLabelModule
  ],
  providers: [MessageService],
  templateUrl: './citas-paciente.component.html',
  styleUrls: ['./citas-paciente.component.scss']
})
export class CitasPacienteComponent {
  showDialog = false;
  citas: any[] = [];
  idPaciente: number = 0;

  nuevaCita = {
    id_consultorio: 1,
    id_medico: 1,
    id_paciente: 0,
    tipo: '',
    horario: '',
    costo: null
  };

  constructor(
    private consultaService: ConsultaService,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('access_token');
    const payload = token ? this.decodeToken(token) : null;
    this.idPaciente = payload?.id || 0;

    if (this.idPaciente) {
      this.cargarCitas();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo identificar al paciente'
      });
    }
  }

  onCerrarSesion() {
    this.authService.logout();
  }

  decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  cargarCitas() {
    this.consultaService.getConsultasPaciente(this.idPaciente).subscribe({
      next: (res) => (this.citas = res),
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las citas'
        })
    });
  }

  guardarCita() {
    const payload = {
      ...this.nuevaCita,
      id_paciente: this.idPaciente,
      diagnostico: '',
      horario: new Date(this.nuevaCita.horario).toISOString()
    };

    this.consultaService.crearConsulta(payload).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Cita creada',
          detail: 'La cita fue registrada exitosamente'
        });
        this.showDialog = false;
        this.cargarCitas();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo registrar la cita'
        });
      }
    });
  }

  goToExpediente() {
    this.router.navigate(['/expediente']);
  }
}
