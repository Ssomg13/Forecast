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
  // Catálogos desde la API
  departamentos: any[] = [];
  subdepartamentos: any[] = [];
  categorias: any[] = [];
  regiones: any[] = [];
  zonas: any[] = [];
  tiendas: any[] = [];
  proveedores: any[] = [];

  // Filtros actuales
  filtros = {
    departamentoId: 0, subdepartamentoId: 0, categoriaId: 0,
    regionId: 0, zonaId: 0, tiendaId: 0, fecha: '', estado: '0'
  };

  proveedorSeleccionado: number = 0;

  // Semanas de la tabla
  semanas = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
  propuestas: { [semana: number]: Propuesta } = {};

  // Estado UI y Modales
  mostrarBannerFaltaDecision = false;
  mostrarModalGuardarFiltro = false;
  mostrarModalCargarFiltros = false;
  nombreNuevoFiltro = '';

  // Simulación de Filtros Guardados en Base de Datos (Con IDs para mapear)
  filtrosGuardados = [
    { id: 1, nombre: 'Norte — Lácteos', regionId: 1, departamentoId: 1, fecha: '2026-05-01' },
    { id: 2, nombre: 'Todas las regiones — Bebidas', regionId: 0, departamentoId: 2, fecha: '2026-05-20' }
  ];

  private apiUrl = 'https://pronosticos-api-production.up.railway.app/api/v1';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarCatalogos();
    this.inicializarSemanas();
  }

  // --- 1. CARGA DE CATÁLOGOS API ---
  cargarCatalogos() {
    this.http.get<any[]>(`${this.apiUrl}/proveedor`).subscribe({ next: (data) => this.proveedores = data });
    this.http.get<any[]>(`${this.apiUrl}/departamento`).subscribe({ next: (data) => this.departamentos = data });
    this.http.get<any[]>(`${this.apiUrl}/subdepartamento`).subscribe({ next: (data) => this.subdepartamentos = data });
    this.http.get<any[]>(`${this.apiUrl}/categoria`).subscribe({ next: (data) => this.categorias = data });
    this.http.get<any[]>(`${this.apiUrl}/region`).subscribe({ next: (data) => this.regiones = data });
    this.http.get<any[]>(`${this.apiUrl}/zona`).subscribe({ next: (data) => this.zonas = data });
    this.http.get<any[]>(`${this.apiUrl}/tienda`).subscribe({ next: (data) => this.tiendas = data });
  }

  obtenerNombreProveedor(): string {
    if (this.proveedorSeleccionado === 0) return 'Ninguno';
    const p = this.proveedores.find(x => x.proveedorId == this.proveedorSeleccionado);
    return p ? (p.razonSocial || p.nombre) : 'Desconocido';
  }

  // --- 2. LÓGICA DE FILTROS Y MODALES ---
  aplicarFiltros() {
    console.log('Aplicando filtros:', this.filtros);
    // Aquí puedes filtrar visualmente los árboles de productos/tiendas
    alert('Filtros aplicados correctamente.');
  }

  limpiarFiltros() {
    this.filtros = { departamentoId: 0, subdepartamentoId: 0, categoriaId: 0, regionId: 0, zonaId: 0, tiendaId: 0, fecha: '', estado: '0' };
  }

  abrirGuardarFiltro() { this.mostrarModalGuardarFiltro = true; }
  cerrarGuardarFiltro() { this.mostrarModalGuardarFiltro = false; this.nombreNuevoFiltro = ''; }

  guardarFiltroEnBD() {
    console.log('Guardando filtro:', this.nombreNuevoFiltro, this.filtros);
    this.cerrarGuardarFiltro();
    alert('Filtro guardado con éxito.');
  }

  abrirCargarFiltros() { this.mostrarModalCargarFiltros = true; }
  cerrarCargarFiltros() { this.mostrarModalCargarFiltros = false; }

  // ¡Aquí se mapea el filtro guardado a los selects de la pantalla!
  cargarFiltroSeleccionado(filtro: any) {
    this.limpiarFiltros(); // Limpiamos primero
    if (filtro.regionId) this.filtros.regionId = filtro.regionId;
    if (filtro.departamentoId) this.filtros.departamentoId = filtro.departamentoId;
    // ... mapear los demás si existen en la BD

    this.cerrarCargarFiltros();
    this.aplicarFiltros(); // Aplicamos el filtro automáticamente al cargarlo
  }

  // --- 3. LÓGICA DE TABLA Y CONTADORES ---
  inicializarSemanas() {
    this.semanas.forEach(s => { this.propuestas[s] = { valorBase: 0, valorPropuesto: 0, estado: 'ninguna' }; });
    this.propuestas[22] = { valorBase: 542, valorPropuesto: 580, estado: 'pendiente' };
    this.propuestas[23] = { valorBase: 533, valorPropuesto: 565, estado: 'pendiente' };
    this.propuestas[24] = { valorBase: 548, valorPropuesto: 515, estado: 'pendiente' };
    this.propuestas[25] = { valorBase: 550, valorPropuesto: 610, estado: 'pendiente' };
    this.propuestas[27] = { valorBase: 559, valorPropuesto: 570, estado: 'pendiente' };
    this.propuestas[29] = { valorBase: 570, valorPropuesto: 610, estado: 'pendiente' };
  }

  calcularVariacion(semana: number): string {
    const p = this.propuestas[semana];
    if (p.estado === 'ninguna' || p.valorBase === 0) return '';
    const variacion = ((p.valorPropuesto - p.valorBase) / p.valorBase) * 100;
    return `${variacion > 0 ? '+' : ''}${Math.round(variacion)}%`;
  }

  get totalPropuestas(): number { return Object.values(this.propuestas).filter(p => p.estado !== 'ninguna').length; }
  get totalAutorizadas(): number { return Object.values(this.propuestas).filter(p => p.estado === 'autorizada').length; }
  get totalPendientes(): number { return Object.values(this.propuestas).filter(p => p.estado === 'pendiente').length; }
  get todasDecididas(): boolean { return this.totalPendientes === 0 && this.totalPropuestas > 0; }

  autorizar(semana: number) { this.propuestas[semana].estado = 'autorizada'; this.validarAprobacionGlobal(); }
  rechazar(semana: number) { this.propuestas[semana].estado = 'rechazada'; this.validarAprobacionGlobal(); }
  deshacer(semana: number) { this.propuestas[semana].estado = 'pendiente'; this.mostrarBannerFaltaDecision = false; }

  autorizarTodas() {
    this.semanas.forEach(s => { if (this.propuestas[s].estado === 'pendiente') this.propuestas[s].estado = 'autorizada'; });
    this.validarAprobacionGlobal();
  }

  validarAprobacionGlobal() { if (this.totalPendientes === 0) this.mostrarBannerFaltaDecision = false; }

  enviarAprobacion() {
    if (this.totalPendientes > 0) {
      this.mostrarBannerFaltaDecision = true;
      return;
    }
    console.log('Enviando aprobación...', this.propuestas);
    alert('Aprobación enviada con éxito al proveedor.');
  }

  // Arboles simulados
  arbolProductos = [{ nombre: 'Lácteos', expandido: true, cantidadTotal: 2, hijos: [{ nombre: 'Leches', cantidad: 1 }, { nombre: 'Yogures', cantidad: 1 }] }];
  arbolTiendas = [{ nombre: 'Norte', expandido: true, cantidadTotal: 1, hijos: [{ nombre: 'Zona 1', cantidad: 1 }] }];
  toggleNodo(nodo: any) { nodo.expandido = !nodo.expandido; }
}
