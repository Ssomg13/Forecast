import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Propuesta {
  valorBase: number;
  valorPropuesto: number;
  estado: 'pendiente' | 'autorizada' | 'rechazada' | 'ninguna';
}

@Component({
  selector: 'app-autorizar-pronosticos',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './autorizar-pronosticos.component.html'
})
export class AutorizarPronosticosComponent implements OnInit {
  // Catálogos
  departamentos: any[] = [];
  subdepartamentos: any[] = [];
  categorias: any[] = [];
  regiones: any[] = [];
  zonas: any[] = [];
  tiendas: any[] = [];
  proveedores: any[] = []; // Obtenidos de la API

  // Estado de los filtros
  filtros = {
    departamentoId: 0, subdepartamentoId: 0, categoriaId: 0,
    regionId: 0, zonaId: 0, tiendaId: 0, fecha: '', estado: '0'
  };

  proveedorSeleccionado: number = 0;

  // Semanas de la tabla
  semanas = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];

  // Diccionario de propuestas por semana
  propuestas: { [semana: number]: Propuesta } = {};

  // Estado UI
  mostrarBannerFaltaDecision = false;
  mostrarModalGuardarFiltro = false;
  mostrarModalCargarFiltros = false;

  private apiUrl = 'https://pronosticos-api-production.up.railway.app/api/v1';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarCatalogos();
    this.inicializarSemanas();
  }

  cargarCatalogos() {
    // Cargar proveedores desde tu API
    this.http.get<any[]>(`${this.apiUrl}/proveedor`).subscribe({
      next: (data) => this.proveedores = data,
      error: (err) => console.error('Error cargando proveedores', err)
    });

    // Aquí irían el resto de las llamadas (departamento, region, etc.)
    this.http.get<any[]>(`${this.apiUrl}/departamento`).subscribe({ next: (data) => this.departamentos = data });
    this.http.get<any[]>(`${this.apiUrl}/region`).subscribe({ next: (data) => this.regiones = data });
  }

  inicializarSemanas() {
    // Inicializamos las celdas vacías
    this.semanas.forEach(s => {
      this.propuestas[s] = { valorBase: 0, valorPropuesto: 0, estado: 'ninguna' };
    });

    // Simulamos los datos de las propuestas basándonos en tu imagen
    this.propuestas[22] = { valorBase: 542, valorPropuesto: 580, estado: 'pendiente' }; // +7%
    this.propuestas[23] = { valorBase: 533, valorPropuesto: 565, estado: 'pendiente' }; // +6%
    this.propuestas[24] = { valorBase: 548, valorPropuesto: 515, estado: 'pendiente' }; // -6%
    this.propuestas[25] = { valorBase: 550, valorPropuesto: 610, estado: 'pendiente' }; // +11%
    this.propuestas[27] = { valorBase: 559, valorPropuesto: 570, estado: 'pendiente' }; // +2%
    this.propuestas[29] = { valorBase: 570, valorPropuesto: 610, estado: 'pendiente' }; // +7%
  }

  // --- LÓGICA DE CÁLCULO Y CONTADORES ---

  calcularVariacion(semana: number): string {
    const p = this.propuestas[semana];
    if (p.estado === 'ninguna' || p.valorBase === 0) return '';
    const variacion = ((p.valorPropuesto - p.valorBase) / p.valorBase) * 100;
    const signo = variacion > 0 ? '+' : '';
    return `${signo}${Math.round(variacion)}%`;
  }

  get totalPropuestas(): number {
    return Object.values(this.propuestas).filter(p => p.estado !== 'ninguna').length;
  }

  get totalAutorizadas(): number {
    return Object.values(this.propuestas).filter(p => p.estado === 'autorizada').length;
  }

  get totalPendientes(): number {
    return Object.values(this.propuestas).filter(p => p.estado === 'pendiente').length;
  }

  get todasDecididas(): boolean {
    return this.totalPendientes === 0 && this.totalPropuestas > 0;
  }

  // --- ACCIONES DE AUTORIZACIÓN ---

  autorizar(semana: number) {
    this.propuestas[semana].estado = 'autorizada';
    this.validarAprobacionGlobal();
  }

  rechazar(semana: number) {
    this.propuestas[semana].estado = 'rechazada';
    this.validarAprobacionGlobal();
  }

  deshacer(semana: number) {
    this.propuestas[semana].estado = 'pendiente';
    this.mostrarBannerFaltaDecision = false;
  }

  autorizarTodas() {
    this.semanas.forEach(s => {
      if (this.propuestas[s].estado === 'pendiente') {
        this.propuestas[s].estado = 'autorizada';
      }
    });
    this.validarAprobacionGlobal();
  }

  validarAprobacionGlobal() {
    // Ocultar banner de advertencia si ya no hay pendientes
    if (this.totalPendientes === 0) {
      this.mostrarBannerFaltaDecision = false;
    }
  }

  enviarAprobacion() {
    if (this.totalPendientes > 0) {
      this.mostrarBannerFaltaDecision = true;
      return;
    }

    console.log('Enviando aprobación al proveedor...', this.propuestas);
    // Aquí llamas al endpoint de tu API para guardar los estados de las propuestas
    alert('Aprobación enviada con éxito al proveedor.');
  }

  // --- ARBOLES SIMULADOS ---
  arbolProductos = [{ nombre: 'Lácteos', expandido: true, cantidadTotal: 2, hijos: [{ nombre: 'Leches', cantidad: 1 }, { nombre: 'Yogures', cantidad: 1 }] }];
  arbolTiendas = [{ nombre: 'Norte', expandido: true, cantidadTotal: 1, hijos: [{ nombre: 'Zona 1', cantidad: 1 }] }];
  toggleNodo(nodo: any) { nodo.expandido = !nodo.expandido; }
}
