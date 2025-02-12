import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="cart-modal" [class.open]="isOpen">
      <div class="modal-backdrop" (click)="close()"></div>
      <div class="modal-content">
        <!-- Etapa 1: Carrinho -->
        <div *ngIf="currentStep === 'cart'">
          <div class="modal-header">
            <h2>Seu Carrinho</h2>
            <button class="close-btn" (click)="close()">×</button>
          </div>
          
          <div class="modal-body">
            <div class="cart-items">
              <div *ngFor="let item of cart$ | async" class="cart-item">
                <img [src]="item.imageUrl" [alt]="item.name">
                <div class="item-details">
                  <h3>{{item.name}}</h3>
                  <p class="price">R$ {{item.price.toFixed(2)}}</p>
                  <div class="quantity-control">
                    <button (click)="updateQuantity(item.id, item.quantity - 1)">-</button>
                    <span>{{item.quantity}}</span>
                    <button (click)="updateQuantity(item.id, item.quantity + 1)">+</button>
                  </div>
                </div>
                <button class="remove-btn" (click)="removeItem(item.id)">×</button>
              </div>
            </div>
            
            <div class="cart-summary">
              <div class="total">
                <span>Total:</span>
                <span>R$ {{total$ | async | number:'1.2-2'}}</span>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-primary" (click)="nextStep()" [disabled]="!(cart$ | async)?.length">
              Continuar para Endereço
            </button>
          </div>
        </div>

        <!-- Etapa 2: Endereço -->
        <div *ngIf="currentStep === 'address'">
          <div class="modal-header">
            <button class="back-btn" (click)="previousStep()">
              <i class="fas fa-arrow-left"></i>
            </button>
            <h2>Endereço de Entrega</h2>
            <button class="close-btn" (click)="close()">×</button>
          </div>

          <div class="modal-body">
            <form #deliveryForm="ngForm">
              <div class="form-group">
                <label for="street">Rua</label>
                <input 
                  type="text" 
                  id="street" 
                  name="street"
                  [(ngModel)]="deliveryInfo.street" 
                  required>
              </div>

              <div class="form-group">
                <label for="number">Número</label>
                <input 
                  type="text" 
                  id="number" 
                  name="number"
                  [(ngModel)]="deliveryInfo.number" 
                  required>
              </div>

              <div class="form-group">
                <label for="complement">Complemento</label>
                <input 
                  type="text" 
                  id="complement" 
                  name="complement"
                  [(ngModel)]="deliveryInfo.complement">
              </div>

              <div class="form-group">
                <label for="neighborhood">Bairro</label>
                <input 
                  type="text" 
                  id="neighborhood" 
                  name="neighborhood"
                  [(ngModel)]="deliveryInfo.neighborhood" 
                  required>
              </div>
            </form>
          </div>

          <div class="modal-footer">
            <button class="btn-primary" (click)="nextStep()" [disabled]="!deliveryForm.form.valid">
              Continuar para Pagamento
            </button>
          </div>
        </div>

        <!-- Etapa 3: Pagamento -->
        <div *ngIf="currentStep === 'payment'">
          <div class="modal-header">
            <button class="back-btn" (click)="previousStep()">
              <i class="fas fa-arrow-left"></i>
            </button>
            <h2>Forma de Pagamento</h2>
            <button class="close-btn" (click)="close()">×</button>
          </div>

          <div class="modal-body">
            <div class="payment-options">
              <div class="payment-option">
                <input 
                  type="radio" 
                  id="pix" 
                  name="paymentMethod"
                  [(ngModel)]="deliveryInfo.paymentMethod" 
                  value="pix">
                <label for="pix">PIX</label>
              </div>

              <div class="payment-option">
                <input 
                  type="radio" 
                  id="card" 
                  name="paymentMethod"
                  [(ngModel)]="deliveryInfo.paymentMethod" 
                  value="card">
                <label for="card">Cartão</label>
              </div>

              <div class="payment-option">
                <input 
                  type="radio" 
                  id="money" 
                  name="paymentMethod"
                  [(ngModel)]="deliveryInfo.paymentMethod" 
                  value="money">
                <label for="money">Dinheiro</label>
              </div>
            </div>

            <div class="payment-location">
              <h3>Local de Pagamento</h3>
              <div class="location-option">
                <input 
                  type="radio" 
                  id="online" 
                  name="paymentLocation"
                  [(ngModel)]="deliveryInfo.paymentLocation" 
                  value="online">
                <label for="online">Online</label>
              </div>

              <div class="location-option">
                <input 
                  type="radio" 
                  id="delivery" 
                  name="paymentLocation"
                  [(ngModel)]="deliveryInfo.paymentLocation" 
                  value="delivery">
                <label for="delivery">Na Entrega</label>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-primary" (click)="finishOrder()">
              Finalizar Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart$: Observable<CartItem[]>;
  total$: Observable<number>;
  isOpen = false;
  currentStep: 'cart' | 'address' | 'payment' = 'cart';
  
  deliveryInfo = {
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    paymentMethod: 'pix',
    paymentLocation: 'online'
  };

  constructor(private cartService: CartService) {
    this.cart$ = this.cartService.cart$;
    this.total$ = this.cartService.total$;
  }

  ngOnInit(): void {}

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.currentStep = 'cart';
    this.deliveryInfo = {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      paymentMethod: 'pix',
      paymentLocation: 'online'
    };
  }

  nextStep() {
    if (this.currentStep === 'cart') {
      this.currentStep = 'address';
    } else if (this.currentStep === 'address') {
      this.currentStep = 'payment';
    }
  }

  previousStep() {
    if (this.currentStep === 'address') {
      this.currentStep = 'cart';
    } else if (this.currentStep === 'payment') {
      this.currentStep = 'address';
    }
  }

  updateQuantity(itemId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(itemId);
      return;
    }
    this.cartService.updateQuantity(itemId, quantity);
  }

  removeItem(itemId: string) {
    this.cartService.removeFromCart(itemId);
  }

  getCartItems(): CartItem[] {
    return this.cartService.getCurrentCartItems();
  }

  finishOrder() {
    // Implementar lógica de finalização do pedido
    console.log('Pedido finalizado:', {
      items: this.getCartItems(),
      delivery: this.deliveryInfo
    });
    this.cartService.clearCart();
    alert('Pedido realizado com sucesso!');
    this.close();
  }
}