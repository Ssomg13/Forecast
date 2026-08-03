import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-pronosticos',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './pronosticos.component.html'
})
export class PronosticosComponent implements OnInit {

  // Catálogos
  departamentos: any[] = [];
  subdepartamentos: any[] = [];
  categorias: any[] = [];
  regiones: any[] = [];
  zonas: any[] = [];
  tiendas: any[] = [];

  // Estado de los modales
  mostrarModalGuardarFiltro = false;
  mostrarModalCargarFiltros = false;
  nombreNuevoFiltro = '';

  // Filtros actuales
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

  // Simulación de filtros guardados en base de datos
  filtrosGuardados = [
    { id: 1, nombre: 'Norte — Lácteos', regiones: 'Norte', departamentos: 'Lácteos', tiendas: '—', fecha: '2026-05-01' },
    { id: 2, nombre: 'Todas las regiones — Bebidas', regiones: '—', departamentos: '—', tiendas: '—', fecha: '2026-05-20' }
  ];

  // Configuración de las semanas y celdas
  semanas = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];

  // Estructura para manejar el estado de cada celda de la fila "Propuesta"
  propuestas: { [key: number]: { valor: number | null, seleccionado: boolean, editando: boolean } } = {};

  private apiUrl = 'https://pronosticos-api-production.up.railway.app/api/v1';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarCatalogosFiltros();
    this.inicializarSemanas();
  }

  inicializarSemanas() {
    this.semanas.forEach(s => {
      this.propuestas[s] = { valor: null, seleccionado: false, editando: false };
    });
    // Dato de ejemplo precargado en la semana 22
    this.propuestas[22].valor = 560;
  }

  cargarCatalogosFiltros() {
    this.http.get<any[]>(`${this.apiUrl}/departamento`).subscribe({ next: (data) => this.departamentos = data });
    this.http.get<any[]>(`${this.apiUrl}/region`).subscribe({ next: (data) => this.regiones = data });
    // ... Agregar el resto de llamadas HTTP aquí ...
  }

  // --- LÓGICA DE LA TABLA Y EDICIÓN ---

  seleccionarCelda(semana: number) {
    // Deseleccionamos todas las demás
    Object.keys(this.propuestas).forEach(key => {
      this.propuestas[Number(key)].seleccionado = false;
      this.propuestas[Number(key)].editando = false; // Cerramos edición si había otra abierta
    });
    // Seleccionamos la actual (esto mostrará el lápiz)
    this.propuestas[semana].seleccionado = true;
  }

  activarEdicion(semana: number, event: Event) {
    event.stopPropagation(); // Evita que se dispare el seleccionarCelda de nuevo
    this.propuestas[semana].editando = true;
  }

  guardarCelda(semana: number, event: Event) {
    event.stopPropagation();
    this.propuestas[semana].editando = false;
    this.propuestas[semana].seleccionado = false;
  }

  // --- LÓGICA DE FILTROS ---

  aplicarFiltros() {
    console.log('Filtros aplicados:', this.filtros);
  }

  limpiarFiltros() {
    this.filtros = { departamentoId: 0, subdepartamentoId: 0, categoriaId: 0, regionId: 0, zonaId: 0, tiendaId: 0, fecha: '', estado: '0' };
  }

  abrirGuardarFiltro() { this.mostrarModalGuardarFiltro = true; }
  cerrarGuardarFiltro() { this.mostrarModalGuardarFiltro = false; this.nombreNuevoFiltro = ''; }

  guardarFiltroEnBD() {
    console.log('Guardando filtro:', this.nombreNuevoFiltro, this.filtros);
    this.cerrarGuardarFiltro();
  }

  abrirCargarFiltros() { this.mostrarModalCargarFiltros = true; }
  cerrarCargarFiltros() { this.mostrarModalCargarFiltros = false; }

  cargarFiltroSeleccionado(filtro: any) {
    console.log('Cargando filtro id:', filtro.id);
    // Aquí mapearías los datos de "filtro" hacia "this.filtros"
    this.cerrarCargarFiltros();
  }

  // --- EXCEL ---

  exportarExcel() {
    // Exportación básica a formato CSV (Compatible con Excel)
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Semana,Histórico,Pronóstico,Propuesta,Estado\n";

    // Generar las columnas dinámicamente
    this.semanas.forEach(s => {
      const valor = this.propuestas[s].valor || 0;
      csvContent += `S${s},0,0,${valor},--\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pronosticos_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  onArchivoExcelSeleccionado(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('Archivo seleccionado para importar:', file.name);
      // Aquí enviarías el archivo a tu backend (Railway) mediante FormData
      /*
      const formData = new FormData();
      formData.append('file', file);
      this.http.post(`${this.apiUrl}/pronostico/importar`, formData).subscribe(...)
      */
      alert('Archivo cargado exitosamente. (Simulación)');
    }
  }

  guardarCambiosGlobales() {
    console.log('Guardando todos los cambios de las propuestas:', this.propuestas);
    // Llamada HTTP al backend para guardar las propuestas
  }
}
