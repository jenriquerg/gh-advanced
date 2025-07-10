import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { CitasEnfermeroComponent } from './pages/enfermero/citas-enfermero/citas-enfermero.component';
import { CitasPacienteComponent } from './pages/paciente/citas-paciente/citas-paciente.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'citas-paciente', component: CitasPacienteComponent },
  { path: 'citas-enfermero', component: CitasEnfermeroComponent },
  { path: '**', redirectTo: 'login' }
];
