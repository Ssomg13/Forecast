import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pronosticos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pronosticos.component.html'
})
export class PronosticosComponent implements OnInit {

  ngOnInit(): void {}

}
