import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  nombreUsuario: string = 'Cargando...';
  rolUsuario: string = '';
  menuAbierto: boolean = false;

  // Variable para el título dinámico
  pantallaActual: string = 'Inicio';

  // Inyectamos también el Router
  constructor(private authService: AuthService, private router: Router) {
    // Nos suscribimos a los cambios de ruta del navegador
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.actualizarTitulo(event.urlAfterRedirects);
    });
  }

  ngOnInit(): void {
    // Al cargar por primera vez, leemos la ruta actual para poner el título
    this.actualizarTitulo(this.router.url);

    // Obtener datos del usuario
    this.authService.obtenerUsuarioActual().subscribe({
      next: (res) => {
        this.nombreUsuario = res.nombreCompleto;
        this.rolUsuario = res.perfil?.nombre || 'Usuario';
      },
      error: (err) => {
        console.error('Error al cargar la información del usuario:', err);
        this.nombreUsuario = 'Usuario';
        this.rolUsuario = 'Sin rol';
      }
    });
  }

  // Función para determinar el nombre de la pantalla según la URL
  actualizarTitulo(url: string): void {
    // Diccionario con todas las rutas y su título exacto a mostrar
    const mapaTitulos: { [key: string]: string } = {
      '/pronosticos': 'Pronósticos',
      '/cambiar-contrasena': 'Cambiar contraseña',
      '/autorizar-pronosticos': 'Autorizar pronósticos',
      '/usuarios': 'Usuarios',
      '/perfiles': 'Perfiles',
      '/plantillas-correo': 'Plantillas de correo',
      '/procesos-sap': 'Procesos SAP'
    };

    let tituloEncontrado = false;

    // Recorremos el diccionario para ver si la URL contiene la ruta
    for (const ruta in mapaTitulos) {
      if (url.includes(ruta)) {
        this.pantallaActual = mapaTitulos[ruta];
        tituloEncontrado = true;
        break;
      }
    }

    // Si la ruta no está en el diccionario (por ejemplo, si agregas una nueva después)
    // formateamos el texto automáticamente quitando guiones y poniendo mayúscula inicial
    if (!tituloEncontrado) {
      const rutaLimpia = url.split('/')[1] || 'Inicio';
      this.pantallaActual = rutaLimpia.charAt(0).toUpperCase() + rutaLimpia.slice(1).replace(/-/g, ' ');
    }
  }

  get inicialUsuario(): string {
    if (this.nombreUsuario && this.nombreUsuario !== 'Cargando...') {
      return this.nombreUsuario.charAt(0).toUpperCase();
    }
    return 'U';
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarSesion(): void {
    // 1. Cerramos el menú visualmente
    this.menuAbierto = false;

    // 2. Borramos el Token de seguridad y cualquier dato guardado
    // (Ajusta 'token' al nombre que uses en tu proyecto, a veces es 'jwt_token' o similar)
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    // Opcional: Si tienes un método logout() en tu authService, puedes llamarlo aquí:
    // this.authService.logout();

    // 3. Redirigimos al usuario a la pantalla principal o de login
    this.router.navigate(['/login']);
  }

}
