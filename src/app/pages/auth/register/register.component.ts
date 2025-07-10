import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { IftaLabelModule } from 'primeng/iftalabel';


import { AuthService } from '../../../core/services/auth.service';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule,
    IftaLabelModule,
  ],
  providers: [MessageService],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  nombre = '';
  apellidos = '';
  fecha_nacimiento = '';
  genero = '';
  correo = '';
  password = '';

  loading = false;
  qrDataUrl: string | null = null;

  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  validatePassword(password: string): string | null {
    if (password.length < 10)
      return 'La contraseña debe tener al menos 12 caracteres';
    if (!/[A-Za-z]/.test(password))
      return 'La contraseña debe contener al menos una letra';
    if (!/[0-9]/.test(password))
      return 'La contraseña debe contener al menos un número';
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
      return 'La contraseña debe contener al menos un símbolo';
    return null;
  }

  async generateQrCode(data: string) {
    try {
      this.qrDataUrl = await QRCode.toDataURL(data);
    } catch (err) {
      console.error('Error generando QR:', err);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al generar el código QR',
      });
    }
  }

  onSubmit() {
    // Validación de campos vacíos
    if (
      !this.nombre ||
      !this.apellidos ||
      !this.fecha_nacimiento ||
      !this.genero ||
      !this.correo ||
      !this.password
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos requeridos',
        detail: 'Por favor llena todos los campos antes de continuar.',
      });
      return;
    }

    // Validación de contraseña
    const pwdError = this.validatePassword(this.password);
    if (pwdError) {
      this.messageService.add({
        severity: 'error',
        summary: 'Contraseña inválida',
        detail: pwdError,
      });
      return;
    }

    this.loading = true;
    this.qrDataUrl = null;

    this.authService
      .register({
        nombre: this.nombre,
        apellidos: this.apellidos,
        fecha_nacimiento: this.fecha_nacimiento,
        genero: this.genero,
        correo: this.correo,
        password: this.password,
      })
      .subscribe({
        next: async (res) => {
          const result = res.data[0];
          await this.generateQrCode(result.qr_url);
          this.messageService.add({
            severity: 'success',
            summary: 'Registro exitoso',
            detail: 'Se generó el código QR para 2FA.',
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err?.error?.data?.[0]?.error || 'Error al registrarse',
          });
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
  }
}
