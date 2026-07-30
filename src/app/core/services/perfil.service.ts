import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Perfil {
  perfilId: number;
  nombre: string;
  tipo: string;
  descripcion?: string;
  fechaAlta?: string;
  activo: boolean;
}

export interface PerfilRequest {
  nombre: string;
  tipo: string;
  descripcion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  // 2. Concatena la URL base con el endpoint específico
  private baseUrl = `${environment.apiUrl}/usuario`;

  constructor(private http: HttpClient) {}

  obtenerPerfiles(): Observable<Perfil[]> {
    return this.http.get<Perfil[]>(this.baseUrl);
  }

  crearPerfil(perfil: PerfilRequest): Observable<Perfil> {
    return this.http.post<Perfil>(this.baseUrl, perfil);
  }

  actualizarPerfil(id: number, perfil: PerfilRequest): Observable<Perfil> {
    return this.http.put<Perfil>(`${this.baseUrl}/${id}`, perfil);
  }

  // La API no tiene DELETE, usamos el endpoint de inactivar
  eliminarPerfil(id: number): Observable<Perfil> {
    return this.http.patch<Perfil>(`${this.baseUrl}/${id}/inactivar`, {});
  }
}
