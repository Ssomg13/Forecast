import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMensaje: string = '';
  mostrarPassword = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  toggleMostrarPassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }
  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          // El Swagger indica que devuelve requiereOtp y usuarioId
          if (res.requiereOtp) {
            // Pasamos el usuarioId a la pantalla de 2FA
            this.router.navigate(['/verificacion'], {
              state: {
                usuarioId: res.usuarioId,
                correo: this.loginForm.value.usuario
              } });
          } else {
            // Si por alguna razón no requiere OTP, redirigimos directo (según lógica de negocio)
            this.router.navigate(['/pronosticos']);
          }
        },
        error: (err) => {
          console.error('Error de login:', err);
          this.errorMensaje = 'Credenciales incorrectas';
        }
      });
    }
  }
}
