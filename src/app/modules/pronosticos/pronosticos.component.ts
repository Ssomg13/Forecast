import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Indispensable para [(ngModel)]
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-pronosticos',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './pronosticos.component.html'
})
export class PronosticosComponent implements OnInit {
  // Arreglos para almacenar los datos de la API
  departamentos: any[] = [];
  subdepartamentos: any[] = [];
  categorias: any[] = [];
  regiones: any[] = [];
  zonas: any[] = [];
  tiendas: any[] = [];

  // Objeto para guardar la selección actual del usuario
  filtros = {
    departamentoId: 0,
    subdepartamentoId: 0,
    categoriaId: 0,
    regionId: 0,
    zonaId: 0,
    tiendaId: 0,
    fecha: '',
    estado: '0'
  };

  // Tu URL base hacia Railway
  private apiUrl = 'https://pronosticos-api-production.up.railway.app/api/v1';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarCatalogosFiltros();
  }

  // Traemos todos los catálogos desde los endpoints de tu API
  cargarCatalogosFiltros() {
    this.http.get<any[]>(`${this.apiUrl}/departamento`).subscribe({
      next: (data) => this.departamentos = data,
      error: (err) => console.error('Error cargando departamentos', err)
    });

    this.http.get<any[]>(`${this.apiUrl}/subdepartamento`).subscribe({
      next: (data) => this.subdepartamentos = data,
      error: (err) => console.error('Error cargando subdepartamentos', err)
    });

    this.http.get<any[]>(`${this.apiUrl}/categoria`).subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error('Error cargando categorias', err)
    });

    this.http.get<any[]>(`${this.apiUrl}/region`).subscribe({
      next: (data) => this.regiones = data,
      error: (err) => console.error('Error cargando regiones', err)
    });

    this.http.get<any[]>(`${this.apiUrl}/zona`).subscribe({
      next: (data) => this.zonas = data,
      error: (err) => console.error('Error cargando zonas', err)
    });

    this.http.get<any[]>(`${this.apiUrl}/tienda`).subscribe({
      next: (data) => this.tiendas = data,
      error: (err) => console.error('Error cargando tiendas', err)
    });
  }

  // Se ejecuta al hacer clic en "Aplicar Filtros"
  aplicarFiltros() {
    console.log('Filtros seleccionados listos para enviar:', this.filtros);
    // Aquí puedes llamar a otro endpoint para cargar los Árboles o la Tabla
    // Ejemplo: this.http.post(`${this.apiUrl}/envio-propuesta-filtro`, this.filtros)...
  }

  // Se ejecuta al hacer clic en "Limpiar"
  limpiarFiltros() {
    this.filtros = {
      departamentoId: 0,
      subdepartamentoId: 0,
      categoriaId: 0,
      regionId: 0,
      zonaId: 0,
      tiendaId: 0,
      fecha: '',
      estado: '0'
    };
  }
}
