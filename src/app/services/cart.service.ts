import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuItem } from '../menu/menu.component';

export interface CartItem extends MenuItem {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private totalSubject = new BehaviorSubject<number>(0);

  cart$ = this.cartSubject.asObservable();
  total$ = this.totalSubject.asObservable();

  addToCart(item: MenuItem) {
    const existingItem = this.items.find(i => i.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ ...item, quantity: 1 });
    }
    
    this.updateCart();
  }

  removeFromCart(itemId: string) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.updateCart();
  }

  updateQuantity(itemId: string, quantity: number) {
    const item = this.items.find(i => i.id === itemId);
    if (item) {
      item.quantity = quantity;
      if (quantity <= 0) {
        this.removeFromCart(itemId);
      } else {
        this.updateCart();
      }
    }
  }

  private updateCart() {
    this.cartSubject.next(this.items);
    this.totalSubject.next(
      this.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    );
  }

  clearCart() {
    this.items = [];
    this.updateCart();
  }
}