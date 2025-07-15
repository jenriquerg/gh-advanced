import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { ConsultaService } from '../../../core/services/consulta.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-citas-medico',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    ToastModule,
    DialogModule,
    InputTextModule,
    FormsModule,
  ],
  providers: [MessageService],
  templateUrl: './citas-medico.component.html',
  styleUrls: ['./citas-medico.component.scss'],
})
export class CitasMedicoComponent {
  citas: any[] = [];
  idMedico: number = 0;

  showEditDialog = false;
  citaEditada: any = null;

  constructor(
    private consultaService: ConsultaService,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('access_token');
    const payload = token ? this.decodeToken(token) : null;
    this.idMedico = payload?.id || 0;

    console.log(this.idMedico);

    if (this.idMedico) {
      this.cargarCitas();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo identificar al médico',
      });
    }
  }

  decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  cargarCitas() {
    this.consultaService.getConsultasMedico(this.idMedico).subscribe({
      next: (res) => (this.citas = res),
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las citas',
        }),
    });
    console.log(this.citas);
  }

  onCerrarSesion() {
    this.authService.logout();
  }

  abrirModalEditar(cita: any) {
    // Clona para no modificar original hasta guardar
    this.citaEditada = { ...cita };
    // Formatea horario para input datetime-local YYYY-MM-DDTHH:mm
    this.citaEditada.horario = new Date(this.citaEditada.horario)
      .toISOString()
      .slice(0, 16);
    this.showEditDialog = true;
  }

  guardarCambios() {
    // Prepara payload para update
    const isoString = new Date(this.citaEditada.horario).toISOString();
    const formattedDate = isoString.slice(0, 19);

    const payload = {
      id_consultorio: this.citaEditada.id_consultorio,
      id_medico: this.citaEditada.id_medico,
      id_paciente: this.citaEditada.id_paciente,
      tipo: this.citaEditada.tipo,
      horario: formattedDate,
      diagnostico: this.citaEditada.diagnostico,
      costo: this.citaEditada.costo,
    };

    this.consultaService
      .updateConsulta(this.citaEditada.id, payload)
      .subscribe({
        next: (updated) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'La cita fue actualizada correctamente',
          });
          this.showEditDialog = false;
          this.cargarCitas();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar la cita',
          });
        },
      });
  }

  verExpediente(idPaciente: number) {
    const token = localStorage.getItem('access_token');
    const payload = token ? this.decodeToken(token) : null;

    if (payload?.permisos?.includes('update_expediente')) {
      this.router.navigate(['/expediente', idPaciente]);
    } else {
      this.router.navigate(['/expediente']);
    }
  }

  verControl(idPaciente: number) {
    const token = localStorage.getItem('access_token');
    const payload = token ? this.decodeToken(token) : null;

    if (payload?.permisos?.includes('add_control')) {
      this.router.navigate(['/llenar-control', idPaciente]);
    } else {
      this.router.navigate(['/llenar-control']);
    }
  }

  irAReceta(idCita: number) {
    const token = localStorage.getItem('access_token');
    const payload = token ? this.decodeToken(token) : null;

    if (payload?.permisos?.includes('add_receta')) {
      this.router.navigate(['/recetas', idCita]);
    }
  }
}
