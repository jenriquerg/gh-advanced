import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

interface LoginRequest {
  correo: string;
  password: string;
  totp_code: string;
}

interface LoginResponse {
  data: [
    {
      access_token: string;
      refresh_token: string;
    }
  ];
  intCode: string;
  statusCode: number;
}

interface RegisterRequest {
  nombre: string;
  apellidos: string;
  fecha_nacimiento: string;
  genero: string;
  correo: string;
  password: string;
}

interface RegisterResponse {
  data: [
    {
      message: string;
      qr_url: string;
    }
  ];
  intCode: string;
  statusCode: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = 'http://127.0.0.1:3000';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap((res) => {
          const tokens = res.data[0];
          localStorage.setItem('access_token', tokens.access_token);
          localStorage.setItem('refresh_token', tokens.refresh_token);
        })
      );
  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    console.log(data);
    return this.http.post<RegisterResponse>(
      `${this.API_URL}/auth/register`,
      data
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
  }
}
