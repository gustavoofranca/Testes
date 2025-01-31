import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input() variant: 'home' | 'default' | 'about' = 'default';
  isAdmin$ = this.authService.isAdmin$;
  cartItemCount$ = this.cartService.cartItemCount$;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  openCart() {
    this.router.navigate(['/cart']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}