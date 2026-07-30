import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Basado en el esquema "UsuarioResponse" de tu Swagger
export interface UsuarioResponse {
  usuarioId: number;
  nombreCompleto: string;
  correo: string;
  perfilId: number;
  proveedorId?: number;
  estado: string;
  fechaAlta?: string;
  ultimoCambioPerfil?: string;
  ultimoAcceso?: string;
}

// Basado en el esquema "UsuarioCreateRequest" de tu Swagger
export interface UsuarioCreateRequest {
  nombreCompleto: string;
  correo: string;
  password?: string;
  perfilId: number;
  proveedorId?: number;
}
export interface UsuarioUpdateRequest {
  nombreCompleto: string;
  correo: string;
  perfilId: number;
  proveedorId?: number;
}


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  // 2. Concatena la URL base con el endpoint específico
  private baseUrl = `${environment.apiUrl}/usuario`;

  constructor(private http: HttpClient) {}

  obtenerUsuarios(): Observable<UsuarioResponse[]> {
    return this.http.get<UsuarioResponse[]>(this.baseUrl);
  }

  crearUsuario(usuario: UsuarioCreateRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(this.baseUrl, usuario);
  }

  actualizarUsuario(id: number, usuario: UsuarioUpdateRequest): Observable<UsuarioResponse> {
    // Hace una petición PUT a /api/v1/usuario/{id}
    return this.http.put<UsuarioResponse>(`${this.baseUrl}/${id}`, usuario);
  }

  inactivarUsuario(id: number): Observable<UsuarioResponse> {
    return this.http.patch<UsuarioResponse>(`${this.baseUrl}/${id}/inactivar`, {});
  }

  activarUsuario(id: number): Observable<UsuarioResponse> {
    return this.http.patch<UsuarioResponse>(`${this.baseUrl}/${id}/activar`, {});
  }
}
