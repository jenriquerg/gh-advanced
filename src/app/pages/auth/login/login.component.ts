import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/services/auth.service';
import { IftaLabelModule } from 'primeng/iftalabel';
import { TokenService } from '../../../core/services/token.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    IftaLabelModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  correo = '';
  password = '';
  totp_code = '';

  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService
  ) {}

  onSubmit() {
    this.loading = true;
    this.error = '';

    this.authService
      .login({
        correo: this.correo,
        password: this.password,
        totp_code: this.totp_code,
      })
      .subscribe({
        next: (res) => {
          const tipo = this.tokenService.decodeToken(
            res.data[0].access_token
          )?.tipo;
          if (tipo === 'paciente') {
            this.router.navigate(['/citas-paciente']);
          } else if (tipo === 'enfermero') {
            this.router.navigate(['/citas-enfermero']);
          } else if (tipo === 'medico') {
            this.router.navigate(['/citas-medico']);
          } else {
            this.error = 'Rol no reconocido';
          }
        },
        error: (err) => {
          console.error(err);
          this.error = 'Credenciales incorrectas o error en el servidor';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
  }
}
