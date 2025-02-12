import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CartComponent } from './components/cart/cart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, CartComponent],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
    <app-cart></app-cart>
  `,
  styles: []
})
export class AppComponent {
  title = 'Testes';
}
