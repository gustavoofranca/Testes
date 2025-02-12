import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from './product.service';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  imageUrl: string;
  name: string;
  price: number;
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
    map(items => items.reduce((total, item) => total + (item.price * item.quantity), 0))
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
    if (!product || !product.id) return;
    
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
      const newItem: CartItem = {
        id: product.id,
        product,
        quantity,
        imageUrl: product.imageUrl || '',
        name: product.name,
        price: product.price
      };
      this.saveCart([...currentItems, newItem]);
    }
  }

  updateQuantity(itemId: string, quantity: number) {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.map(item =>
      item.id === itemId
        ? { ...item, quantity: Math.max(0, quantity) }
        : item
    ).filter(item => item.quantity > 0);
    
    this.saveCart(updatedItems);
  }

  removeFromCart(itemId: string) {
    const updatedItems = this.cartItems.value.filter(item => item.id !== itemId);
    this.saveCart(updatedItems);
  }

  clearCart() {
    this.saveCart([]);
  }

  // Método para acesso ao valor atual do carrinho
  getCurrentCartItems(): CartItem[] {
    return this.cartItems.value;
  }
}