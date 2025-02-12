import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { CartComponent } from '../cart/cart.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, CartComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input() variant: 'home' | 'default' | 'about' = 'default';
  @ViewChild(CartComponent) cartComponent!: CartComponent;
  
  isAdmin$ = this.authService.isAdmin$;
  cartItemCount$ = this.cartService.cartItemCount$;

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {}

  openCart() {
    if (this.cartComponent) {
      this.cartComponent.open();
    }
  }

  logout() {
    this.authService.logout();
  }
}