import { Component, Input, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CartComponent } from '../cart/cart.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, CartComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input() variant: 'home' | 'dashboard' = 'dashboard';
  @ViewChild(CartComponent) cartComponent!: CartComponent;

  cartCount$ = this.cartService.cart$.pipe(
    map(items => items.reduce((total, item) => total + item.quantity, 0))
  );

  constructor(private cartService: CartService) {}

  openCart() {
    this.cartComponent.open();
  }
}