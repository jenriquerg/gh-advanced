import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { RecetaService, NuevaReceta } from '../../../core/services/receta.service';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-receta',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './recetas.component.html',
  styleUrl: './recetas.component.scss',
})
export class RecetasComponent implements OnInit {
  receta: NuevaReceta = {
    id_consulta: 0,
    fecha: '',
    id_medico: 0,
    medicamento: '',
    dosis: '',
  };

  constructor(
    private recetaService: RecetaService,
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('access_token');
    const payload = token ? this.tokenService.decodeToken(token) : null;

    this.receta.id_medico = payload?.id || 0;
    this.receta.id_consulta = Number(this.route.snapshot.paramMap.get('id')) || 0;

    const today = new Date();
    this.receta.fecha = today.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  guardarReceta() {
    this.recetaService.createReceta(this.receta).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Receta registrada',
          detail: 'La receta se guardó correctamente',
        });
        setTimeout(() => this.location.back(), 1000);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo guardar la receta',
        });
      },
    });
  }

  regresar() {
    this.location.back();
  }
}
