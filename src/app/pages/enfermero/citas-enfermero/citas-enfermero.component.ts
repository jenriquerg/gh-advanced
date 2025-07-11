import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {
  ConsultaService,
  Consulta,
} from '../../../core/services/consulta.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-citas-enfermero',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, TableModule, ToastModule],
  providers: [MessageService],
  templateUrl: './citas-enfermero.component.html',
  styleUrls: ['./citas-enfermero.component.scss'],
})
export class CitasEnfermeroComponent {
  medicoId: number | null = null;
  citas: Consulta[] = [];
  selectedCita: Consulta | null = null;

  constructor(
    private consultaService: ConsultaService,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService
  ) {}

  onCerrarSesion() {
    this.authService.logout();
  }

  irALlenarControl(idPaciente: number) {
    this.router.navigate(['/llenar-control', idPaciente]);
  }
  cargarCitas() {
    if (!this.medicoId || this.medicoId < 1) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Debes ingresar un ID de médico válido',
      });
      this.citas = [];
      this.selectedCita = null;
      return;
    }

    this.consultaService.getConsultasMedico(this.medicoId).subscribe({
      next: (res) => {
        this.citas = res;
        this.selectedCita = null;
        if (res.length === 0) {
          this.messageService.add({
            severity: 'info',
            summary: 'Sin citas',
            detail: 'No se encontraron citas para este médico',
          });
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las citas',
        });
        this.citas = [];
        this.selectedCita = null;
      },
    });
  }

  onCitaSelect(event: any) {
    this.selectedCita = event.data;
  }

  verExpediente() {
    if (!this.selectedCita) return;
    this.router.navigate(['/expediente', this.selectedCita.id_paciente]);
  }

  llenarControl() {
    if (!this.selectedCita) return;
    this.router.navigate(['/control', this.selectedCita.id]);
  }
}
