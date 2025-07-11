import { Routes } from '@angular/router';

import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { CitasEnfermeroComponent } from './pages/enfermero/citas-enfermero/citas-enfermero.component';
import { CitasPacienteComponent } from './pages/paciente/citas-paciente/citas-paciente.component';
import { ExpedienteComponent } from './pages/expediente/expediente/expediente.component';
import { LlenarControlComponent } from './pages/control/llenar-control/llenar-control.component';

import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: 'citas-paciente',
    component: CitasPacienteComponent,
    canActivate: [authGuard],
    data: { permiso: 'get_consultas_paciente' }
  },
  {
    path: 'citas-enfermero',
    component: CitasEnfermeroComponent,
    canActivate: [authGuard],
    data: { permiso: 'get_consultas_medico' }
  },
  {
    path: 'expediente',
    component: ExpedienteComponent,
    canActivate: [authGuard],
    data: { permiso: 'get_expediente' }
  },
  {
    path: 'llenar-control/:id',
    component: LlenarControlComponent,
    canActivate: [authGuard],
    data: { permiso: 'add_control' }
  },

  // fallback
  { path: '**', redirectTo: 'login' }
];
