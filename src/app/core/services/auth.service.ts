import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse, ValidarOtpRequest, ValidarOtpResponse, MeResponse, CambiarPasswordPropioRequest } from '../models/auth.models';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Apuntando directo a Railway para tu prueba
  private baseUrl = 'https://pronosticos-api-production.up.railway.app/api/v1/auth';

  constructor(private http: HttpClient) {}

  // POST forzado como formulario (sin OPTIONS)
  // ¡Fíjate que diga this.http.post y NO this.http.get!
  login(credentials: LoginRequest): Observable<LoginResponse> {
    // Angular envía automáticamente los datos como JSON,
    // que es lo que pide el Swagger de tu Back End.
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials);
  }


  // POST normal con JSON (Restaurado para que no falle la compilación)
  validarOtp(data: ValidarOtpRequest): Observable<ValidarOtpResponse> {
    // Agregamos una barra (/) al final de validar-otp
    return this.http.post<ValidarOtpResponse>(`${this.baseUrl}/validar-otp`, data);
  }
  obtenerUsuarioActual(): Observable<MeResponse> {
    // Asegúrate de que el token JWT se esté enviando en los headers (Angular lo hace con un Interceptor o puedes pasarlo manual si aún no lo tienes)
    return this.http.get<MeResponse>(`${this.baseUrl}/me`);
  }
  cambiarPassword(datos: CambiarPasswordPropioRequest): Observable<any> {
    // Hace un PUT a /api/v1/auth/password
    return this.http.put(`${this.baseUrl}/password`, datos);
  }
}
