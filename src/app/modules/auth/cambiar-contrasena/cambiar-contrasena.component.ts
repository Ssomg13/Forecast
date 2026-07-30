import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// 1. IMPORTAMOS EL SERVICIO (y asegúrate de que la ruta a tus modelos sea la correcta)
import { AuthService } from '../../../core/services/auth.service';
import { CambiarPasswordPropioRequest } from '../../../core/models/auth.models';

@Component({
  selector: 'app-cambiar-contrasena',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cambiar-contrasena.component.html'
})
export class CambiarContrasenaComponent {

  datos = {
    passwordActual: '',
    nuevaPassword: '',
    confirmarPassword: ''
  };

  // Banderas para mostrar/ocultar texto de las contraseñas
  mostrarActual: boolean = false;
  mostrarNueva: boolean = false;

  // 2. INYECTAMOS EL SERVICIO AQUÍ (estaba vacío)
  constructor(private authService: AuthService) {}

  toggleMostrarActual() {
    this.mostrarActual = !this.mostrarActual;
  }

  toggleMostrarNueva() {
    this.mostrarNueva = !this.mostrarNueva;
  }

  actualizarContrasena() {
    // 1. Validaciones
    if (!this.datos.passwordActual || !this.datos.nuevaPassword || !this.datos.confirmarPassword) {
      alert('Por favor, llena todos los campos.');
      return;
    }

    if (this.datos.nuevaPassword !== this.datos.confirmarPassword) {
      alert('Las contraseñas nuevas no coinciden.');
      return;
    }

    // 2. Preparamos el payload EXACTO como lo pide el Swagger
    const payload: CambiarPasswordPropioRequest = {
      passwordActual: this.datos.passwordActual,
      passwordNuevo: this.datos.nuevaPassword
    };

    // 3. Enviamos la petición real a la API
    this.authService.cambiarPassword(payload).subscribe({
      next: () => {
        alert('¡Contraseña actualizada con éxito!');
        // Limpiamos los campos después de guardar
        this.datos = { passwordActual: '', nuevaPassword: '', confirmarPassword: '' };
      },
      error: (err) => {
        console.error('Error completo del servidor:', err);

        // Si es un error 401 o 403, significa que Angular no está enviando el Token JWT
        if (err.status === 401 || err.status === 403) {
          alert('Error de seguridad: Tu sesión no es válida o falta configurar el envío del Token JWT en las peticiones.');
        }
        // Si es un error 400, los datos están mal (ej. la contraseña no es lo suficientemente segura)
        else if (err.status === 400) {
          // Intentamos leer el mensaje exacto que manda tu Back End
          const mensajeBackend = err.error?.mensaje || err.error?.message || 'La nueva contraseña no cumple con los requisitos mínimos (ej. 8 caracteres, mayúsculas, números).';
          alert('Datos inválidos: ' + mensajeBackend);
        }
        // Cualquier otro error
        else {
          alert('Hubo un problema. Si estás seguro de que tu contraseña actual es correcta, abre la consola (F12) para ver el detalle técnico.');
        }
      }
    });
  }
}
