import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Perfil {
  perfilId: number;
  nombre: string;
  tipo: string;
  descripcion?: string;
  fechaAlta?: string;
  activo: boolean;
  // Nota: usuariosCount no viene en la API actual, lo simularemos en la vista.
}

export interface PerfilRequest {
  nombre: string;
  tipo: string;
  descripcion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private baseUrl = '/api/v1/perfil';

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
