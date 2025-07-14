import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


import {
  Expediente,
  ExpedienteService,
} from '../../../core/services/expediente.service';
import { TokenService } from '../../../core/services/token.service';
@Component({
  selector: 'app-expediente',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    PanelModule,
    TagModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
  ],
  templateUrl: './expediente.component.html',
  styleUrl: './expediente.component.scss',
})
export class ExpedienteComponent implements OnInit {
  expediente: Expediente | null = null;
  error: string | null = null;

  showEditModal = false;
  editableExpediente: Partial<Expediente> = {};
  canEdit = false;

  constructor(
  private expedienteService: ExpedienteService,
  private tokenService: TokenService,
  private location: Location,
  private route: ActivatedRoute
) {}

ngOnInit(): void {
  const token = localStorage.getItem('access_token');
  const payload = token ? this.tokenService.decodeToken(token) : null;

  const idParam = this.route.snapshot.paramMap.get('id');
  const idPaciente = idParam ? +idParam : payload?.id;

  this.canEdit = payload?.permisos?.includes('update_expediente');

  this.expedienteService.getExpediente(idPaciente).subscribe({
    next: (data) => {
      this.expediente = data;
      this.editableExpediente = { ...data };
    },
    error: () => (this.error = 'No se pudo obtener el expediente.'),
  });
}

  regresar() {
    this.location.back();
  }

  openEditModal() {
    this.editableExpediente = { ...this.expediente! };
    this.showEditModal = true;
  }

  guardarCambios() {
    if (!this.expediente) return;

    this.editableExpediente.fecha_actualizacion = new Date()
      .toISOString()
      .split('T')[0];

    this.expedienteService
      .updateExpediente(this.expediente.id, this.editableExpediente)
      .subscribe({
        next: (updated) => {
          this.expediente = updated;
          this.showEditModal = false;
        },
        error: () => {
          this.error = 'No se pudo actualizar el expediente.';
          this.showEditModal = false;
        },
      });
  }
}
