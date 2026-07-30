import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // 1. OBLIGATORIO para usar <router-outlet>
import { HeaderComponent } from '../header/header.component'; // 2. Ajusta esta ruta a donde hayas creado tu componente de encabezado

@Component({
  selector: 'app-main-layout',
  standalone: true,
  // 3. Declaramos que este Layout usará tanto el RouterOutlet como tu Encabezado
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent {

}
