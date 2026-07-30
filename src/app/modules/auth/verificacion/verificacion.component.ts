import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Asegúrate de tener esto
import { FormsModule } from '@angular/forms';   // <-- ESTO ES LO QUE FALTA PARA EL ngModel
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ValidarOtpRequest, ValidarOtpResponse } from '../../../core/models/auth.models';

@Component({
  selector: 'app-verificacion',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- Agrégalos aquí dentro
  templateUrl: './verificacion.component.html'
})
export class VerificacionComponent implements OnInit {
  codigo: string = '';
  usuarioId: any = null;
  correo: string = '';
  errorMensaje: string = '';

  constructor(private authService: AuthService, private router: Router) {
    // 1. Capturamos los datos que viajaron en el state desde el Login
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { usuarioId: any; correo: string };

    if (state) {
      this.usuarioId = state.usuarioId;
      this.correo = state.correo;
    }
  }

  ngOnInit(): void {
    // 2. Si alguien recarga la página (F5) y el state se pierde, los mandamos de regreso al login
    if (!this.usuarioId) {
      console.warn('No se encontró el ID de usuario, redirigiendo al login...');
      this.router.navigate(['/login']);
    }
  }
  verificar() {
    const codigoLimpio = this.codigo ? this.codigo.trim() : '';

    // Candado para asegurar que sean 6 dígitos y exista el ID de usuario
    if (codigoLimpio.length === 6 && this.usuarioId) {
      const payload: ValidarOtpRequest = {
        usuarioId: this.usuarioId,
        codigo: codigoLimpio
      };

      this.authService.validarOtp(payload).subscribe({
        next: (res: ValidarOtpResponse) => {
          // Validamos que el servidor responda que el código es autentiicado y nos dé el token
          if (res.autenticado && res.token) {
            // 1. Guardamos el token de seguridad
            localStorage.setItem('token', res.token);

            // 2. ¡AQUÍ ES DONDE SE ABRE LA PANTALLA DE PRONÓSTICOS!
            this.router.navigate(['/pronosticos']);
          }
        },
        error: (err: any) => {
          console.error('Error al validar código:', err);
          // Muestra el mensaje en rojo en tu diseño si el código falla
          this.errorMensaje = 'Código incorrecto o expirado';
        }
      });
    } else {
      this.errorMensaje = 'Ingresa los 6 dígitos completos';
    }
  }
}
