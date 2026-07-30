import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService, UsuarioResponse, UsuarioCreateRequest, UsuarioUpdateRequest } from '../../core/services/usuario.service';
import { PerfilService, Perfil } from '../../core/services/perfil.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent implements OnInit {
  usuarios: UsuarioResponse[] = [];
  mostrarModal: boolean = false;
  terminoBusqueda: string = '';
  perfiles: Perfil[] = [];

  // Banderas para saber si estamos editando
  modoEdicion: boolean = false;
  usuarioEdicionId: number = 0;
  estadoOriginalActivo: boolean = true;

  nuevoUsuario = {
    nombreCompleto: '',
    correo: '',
    perfilId: 0,
    password: '',
    confirmarPassword: '',
    activo: true
  };

  constructor(
    private usuarioService: UsuarioService,
    private perfilService: PerfilService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarPerfiles();
  }
  cargarPerfiles() {
    this.perfilService.obtenerPerfiles().subscribe({
      next: (data) => {
        // Guardamos solo los perfiles que están activos
        this.perfiles = data.filter(p => p.activo !== false);
      },
      error: (err) => console.error('Error al obtener perfiles', err)
    });
  }
  cargarUsuarios() {
    this.usuarioService.obtenerUsuarios().subscribe({
      next: (data) => this.usuarios = data,
      error: (err) => console.error('Error al obtener los usuarios', err)
    });
  }

  get usuariosFiltrados(): UsuarioResponse[] {
    if (!this.terminoBusqueda) return this.usuarios;
    const termino = this.terminoBusqueda.toLowerCase();
    return this.usuarios.filter(u =>
      u.nombreCompleto.toLowerCase().includes(termino) || u.correo.toLowerCase().includes(termino)
    );
  }

  // Se llama con el botón azul de "Nuevo usuario"
  abrirModal() {
    this.modoEdicion = false;
    this.usuarioEdicionId = 0;
    this.mostrarModal = true;
    this.nuevoUsuario = { nombreCompleto: '', correo: '', perfilId: 0, password: '', confirmarPassword: '', activo: true };
  }

  // Novedad: Se llama al darle clic al lapicito en la tabla
  abrirModalEdicion(usuario: UsuarioResponse) {
    this.modoEdicion = true;
    this.usuarioEdicionId = usuario.usuarioId;
    this.estadoOriginalActivo = usuario.estado === 'Activo';
    this.mostrarModal = true;

    // Precargamos los datos del usuario en el formulario
    this.nuevoUsuario = {
      nombreCompleto: usuario.nombreCompleto,
      correo: usuario.correo,
      perfilId: usuario.perfilId,
      password: '', // Las contraseñas no se cargan por seguridad
      confirmarPassword: '',
      activo: this.estadoOriginalActivo
    };
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarUsuario() {
    // Validamos perfil
    if (this.nuevoUsuario.perfilId === 0) {
      alert('Selecciona un perfil');
      return;
    }

    // SI ESTAMOS EDITANDO
    if (this.modoEdicion) {
      const payloadActualizar: UsuarioUpdateRequest = {
        nombreCompleto: this.nuevoUsuario.nombreCompleto,
        correo: this.nuevoUsuario.correo,
        perfilId: Number(this.nuevoUsuario.perfilId)
      };
      this.usuarioService.actualizarUsuario(this.usuarioEdicionId, payloadActualizar).subscribe({
        next: () => {

          // 2. Verificamos si el usuario movió el interruptor de estado
          if (this.nuevoUsuario.activo !== this.estadoOriginalActivo) {

            // Si lo prendió, lo activamos
            if (this.nuevoUsuario.activo) {
              this.usuarioService.activarUsuario(this.usuarioEdicionId).subscribe(() => {
                this.cerrarModal();
                this.cargarUsuarios();
              });
            }
            // Si lo apagó, lo inactivamos
            else {
              this.usuarioService.inactivarUsuario(this.usuarioEdicionId).subscribe(() => {
                this.cerrarModal();
                this.cargarUsuarios();
              });
            }

          } else {
            // Si no movió el interruptor, solo cerramos y recargamos
            this.cerrarModal();
            this.cargarUsuarios();
          }

        },
        error: (err) => console.error('Error al actualizar usuario', err)
      });
    }
  }

  cambiarEstadoUsuario(usuario: UsuarioResponse) {
    const accion = usuario.estado === 'Activo' ? 'inactivar' : 'activar';
    const confirmacion = confirm(`¿Estás seguro de que deseas ${accion} al usuario "${usuario.nombreCompleto}"?`);

    if (confirmacion) {
      if (usuario.estado === 'Activo') {
        this.usuarioService.inactivarUsuario(usuario.usuarioId).subscribe({
          next: () => this.cargarUsuarios(), // Recargamos la tabla para ver el cambio
          error: (err) => console.error('Error al inactivar usuario', err)
        });
      } else {
        this.usuarioService.activarUsuario(usuario.usuarioId).subscribe({
          next: () => this.cargarUsuarios(), // Recargamos la tabla para ver el cambio
          error: (err) => console.error('Error al activar usuario', err)
        });
      }
    }
  }
  obtenerNombrePerfil(perfilId: number): string {
    const perfilEncontrado = this.perfiles.find(p => p.perfilId === perfilId);
    return perfilEncontrado ? perfilEncontrado.nombre : 'Desconocido';
  }
}
