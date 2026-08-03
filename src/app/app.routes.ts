import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { VerificacionComponent } from './modules/auth/verificacion/verificacion.component';
import { PronosticosComponent } from './modules/pronosticos/pronosticos.component';
import { UsuariosComponent } from './modules/usuarios/usuarios.component';
import { MainLayoutComponent } from './modules/main-layout/main-layout.component';
import {PerfilesComponent} from './modules/perfiles/perfiles.component';
import { CambiarContrasenaComponent } from './modules/auth/cambiar-contrasena/cambiar-contrasena.component';
import {AutorizarPronosticosComponent} from "./modules/autorizar-pronosticos/autorizar-pronosticos.component";

export const routes: Routes = [
  // 1. RUTAS PÚBLICAS (No tienen encabezado)
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'verificacion', component: VerificacionComponent },

  // 2. RUTAS PRIVADAS (Envueltas en el Layout con el encabezado)
  {
    path: '',
    component: MainLayoutComponent, // El Layout carga el Encabezado
    children: [
      // Todo lo que pongas aquí aparecerá "debajo" del encabezado
      { path: 'pronosticos', component: PronosticosComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'perfiles', component: PerfilesComponent },
      { path: 'cambiar-contrasena', component: CambiarContrasenaComponent },
      { path: 'autorizar-pronosticos', component: AutorizarPronosticosComponent },
    ]
  }
];
