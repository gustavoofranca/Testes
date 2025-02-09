import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from './product.service';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartItems.asObservable();

  cartItemCount$ = this.cart$.pipe(
    map(items => items.reduce((total, item) => total + item.quantity, 0))
  );

  total$ = this.cart$.pipe(
    map(items => items.reduce((total, item) => total + (item.product.price * item.quantity), 0))
  );

  constructor() {
    // Carregar carrinho do localStorage se existir
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems.next(JSON.parse(savedCart));
    }
  }

  private saveCart(items: CartItem[]) {
    localStorage.setItem('cart', JSON.stringify(items));
    this.cartItems.next(items);
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      const updatedItems = currentItems.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      this.saveCart(updatedItems);
    } else {
      this.saveCart([...currentItems, { id: product.id!, name: product.name, price: product.price, imageUrl: product.imageUrl, product, quantity }]);
    }
  }

  removeFromCart(productId: string) {
    const updatedItems = this.cartItems.value.filter(item => item.product.id !== productId);
    this.saveCart(updatedItems);
  }

  updateQuantity(productId: string, quantity: number) {
    const updatedItems = this.cartItems.value.map(item =>
      item.product.id === productId
        ? { ...item, quantity: Math.max(0, quantity) }
        : item
    ).filter(item => item.quantity > 0);
    
    this.saveCart(updatedItems);
  }

  clearCart() {
    this.saveCart([]);
  }

  getCartItems(): CartItem[] {
    return this.cartItems.value;
  }

  checkout() {
    const transaction = {
      items: [...this.getCartItems()],
      total: this.getCartItems().reduce((total, item) => total + (item.product.price * item.quantity), 0)
    };
    this.clearCart();
    return transaction;
  }
}