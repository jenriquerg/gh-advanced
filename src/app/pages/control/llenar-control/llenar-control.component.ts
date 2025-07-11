import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { IftaLabelModule } from 'primeng/iftalabel';
import {
  ControlService,
  Control,
} from '../../../core/services/control.service';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-llenar-control',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    TableModule,
    ButtonModule,
    IftaLabelModule,
    DialogModule,
  ],
  providers: [MessageService],
  templateUrl: './llenar-control.component.html',
  styleUrls: ['./llenar-control.component.scss'],
})
export class LlenarControlComponent {
  pacienteId: number = 0;
  control: Control = this.initControl();
  controles: Control[] = [];
  showDialog: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private controlService: ControlService,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.pacienteId = Number(this.route.snapshot.paramMap.get('id'));
    this.control.paciente_id = this.pacienteId;
    this.cargarControles();
  }

  initControl(): Control {
    return {
      paciente_id: 0,
      peso_kg: 0,
      altura_cm: 0,
      imc: 0,
      presion_arterial: '',
      frecuencia_cardiaca: 0,
      frecuencia_respiratoria: 0,
      temperatura_c: 0,
      nivel_glucosa: 0,
      saturacion_oxigeno: 0,
      notas_generales: '',
      fecha: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    };
  }

  gotoBack() {
    this.router.navigate(['/citas-enfermero']);
  }

  onCerrarSesion() {
    this.authService.logout();
  }

  guardarControl() {
    this.controlService.crearControl(this.control).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Control guardado',
          detail: 'El control fue registrado correctamente',
        });
        this.control = this.initControl();
        this.control.paciente_id = this.pacienteId;
        this.cargarControles();
        this.showDialog = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo guardar el control',
        });
      },
    });
  }

  cargarControles() {
    this.controlService.getControlesPaciente(this.pacienteId).subscribe({
      next: (res) => (this.controles = res),
      error: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'No se pudieron cargar los controles',
        });
      },
    });
  }
}
