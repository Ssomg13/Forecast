import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerfilService, Perfil, PerfilRequest } from '../../core/services/perfil.service';

@Component({
  selector: 'app-perfiles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfiles.component.html'
})
export class PerfilesComponent implements OnInit {
  perfiles: Perfil[] = [];
  mostrarModal: boolean = false;

  // Banderas de edición
  modoEdicion: boolean = false;
  perfilEdicionId: number = 0;

  // Objeto para el formulario
  nuevoPerfil: PerfilRequest = {
    nombre: '',
    tipo: '',
    descripcion: ''
  };

  constructor(private perfilService: PerfilService) {}

  ngOnInit(): void {
    this.cargarPerfiles();
  }

  cargarPerfiles() {
    this.perfilService.obtenerPerfiles().subscribe({
      next: (data) => {
        // Filtramos solo los activos si es necesario, o mostramos todos
        this.perfiles = data.filter(p => p.activo !== false);
      },
      error: (err) => console.error('Error al obtener perfiles', err)
    });
  }

  // Cálculos para las tarjetas superiores (KPIs)
  get totalAdministradores(): number {
    return this.perfiles.filter(p => p.tipo === 'Administrador').length;
  }

  get totalProveedores(): number {
    return this.perfiles.filter(p => p.tipo === 'Proveedor').length;
  }

  get totalCompradores(): number {
    return this.perfiles.filter(p => p.tipo === 'Comprador').length;
  }

  abrirModal() {
    this.modoEdicion = false;
    this.perfilEdicionId = 0;
    this.nuevoPerfil = { nombre: '', tipo: 'Administrador', descripcion: '' };
    this.mostrarModal = true;
  }

  abrirModalEdicion(perfil: Perfil) {
    this.modoEdicion = true;
    this.perfilEdicionId = perfil.perfilId;
    this.nuevoPerfil = {
      nombre: perfil.nombre,
      tipo: perfil.tipo,
      descripcion: perfil.descripcion || ''
    };
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  seleccionarTipo(tipo: string) {
    this.nuevoPerfil.tipo = tipo;
  }

  guardarPerfil() {
    if (!this.nuevoPerfil.nombre || !this.nuevoPerfil.tipo) {
      alert('El nombre y el tipo son obligatorios');
      return;
    }

    if (this.modoEdicion) {
      this.perfilService.actualizarPerfil(this.perfilEdicionId, this.nuevoPerfil).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarPerfiles();
        },
        error: (err) => console.error('Error al actualizar perfil', err)
      });
    } else {
      this.perfilService.crearPerfil(this.nuevoPerfil).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarPerfiles();
        },
        error: (err) => console.error('Error al crear perfil', err)
      });
    }
  }

  eliminarPerfil(perfil: Perfil) {
    if (confirm(`¿Estás seguro de que deseas eliminar el perfil "${perfil.nombre}"?`)) {
      this.perfilService.eliminarPerfil(perfil.perfilId).subscribe({
        next: () => {
          this.cargarPerfiles();
        },
        error: (err) => console.error('Error al eliminar perfil', err)
      });
    }
  }
}
