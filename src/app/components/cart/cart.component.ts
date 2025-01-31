import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';

interface DeliveryInfo {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  paymentMethod: 'credit' | 'debit' | 'pix' | 'cash';
  paymentLocation: 'online' | 'delivery';
  change?: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="modal-overlay" [class.active]="isOpen" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <!-- Etapa 1: Carrinho -->
        <div *ngIf="currentStep === 'cart'">
          <div class="modal-header">
            <h2>Seu Carrinho</h2>
            <button class="close-btn" (click)="close()">×</button>
          </div>
          
          <div class="modal-body">
            <div class="cart-items" *ngIf="(cart$ | async)?.length; else emptyCart">
              <div class="cart-item" *ngFor="let item of cart$ | async">
                <img [src]="item.imageUrl" [alt]="item.name">
                <div class="item-details">
                  <h3>{{item.name}}</h3>
                  <p class="price">R$ {{item.price.toFixed(2)}}</p>
                  <div class="quantity-control">
                    <button (click)="updateQuantity(item, item.quantity - 1)">-</button>
                    <span>{{item.quantity}}</span>
                    <button (click)="updateQuantity(item, item.quantity + 1)">+</button>
                  </div>
                </div>
                <button class="remove-btn" (click)="removeItem(item)">×</button>
              </div>
            </div>
            
            <ng-template #emptyCart>
              <div class="empty-cart">
                <p>Seu carrinho está vazio</p>
                <a [routerLink]="['/menu']" (click)="close()">Ver cardápio</a>
              </div>
            </ng-template>
          </div>

          <div class="modal-footer" *ngIf="(cart$ | async)?.length">
            <div class="total">
              <span>Total:</span>
              <span>R$ {{total$ | async | number:'1.2-2'}}</span>
            </div>
            <button class="primary-btn" (click)="nextStep()">Continuar</button>
          </div>
        </div>

        <!-- Etapa 2: Endereço -->
        <div *ngIf="currentStep === 'address'">
          <div class="modal-header">
            <button class="back-btn" (click)="currentStep = 'cart'">
              <i class="fas fa-arrow-left"></i>
            </button>
            <h2>Endereço de Entrega</h2>
            <button class="close-btn" (click)="close()">×</button>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <label>Rua</label>
              <input type="text" [(ngModel)]="deliveryInfo.street" placeholder="Nome da rua">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Número</label>
                <input type="text" [(ngModel)]="deliveryInfo.number" placeholder="Número">
              </div>
              <div class="form-group">
                <label>Complemento (opcional)</label>
                <input type="text" [(ngModel)]="deliveryInfo.complement" placeholder="Apto, Bloco, etc">
              </div>
            </div>

            <div class="form-group">
              <label>Bairro</label>
              <input type="text" [(ngModel)]="deliveryInfo.neighborhood" placeholder="Bairro">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Cidade</label>
                <input type="text" [(ngModel)]="deliveryInfo.city" placeholder="Cidade">
              </div>
              <div class="form-group">
                <label>Estado</label>
                <input type="text" [(ngModel)]="deliveryInfo.state" placeholder="Estado">
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="primary-btn" (click)="nextStep()" 
                    [disabled]="!deliveryInfo.street || !deliveryInfo.number || !deliveryInfo.neighborhood || !deliveryInfo.city || !deliveryInfo.state">
              Continuar para Pagamento
            </button>
          </div>
        </div>

        <!-- Etapa 3: Pagamento -->
        <div *ngIf="currentStep === 'payment'">
          <div class="modal-header">
            <button class="back-btn" (click)="currentStep = 'address'">
              <i class="fas fa-arrow-left"></i>
            </button>
            <h2>Forma de Pagamento</h2>
            <button class="close-btn" (click)="close()">×</button>
          </div>

          <div class="modal-body">
            <div class="payment-location">
              <h3>Onde deseja pagar?</h3>
              <div class="radio-group">
                <label>
                  <input type="radio" [(ngModel)]="deliveryInfo.paymentLocation" value="online">
                  Pagar agora online
                </label>
                <label>
                  <input type="radio" [(ngModel)]="deliveryInfo.paymentLocation" value="delivery">
                  Pagar na entrega
                </label>
              </div>
            </div>

            <div class="payment-methods">
              <h3>Método de Pagamento</h3>
              <div class="radio-group">
                <ng-container *ngIf="deliveryInfo.paymentLocation === 'online'">
                  <label>
                    <input type="radio" [(ngModel)]="deliveryInfo.paymentMethod" value="credit">
                    Cartão de Crédito
                  </label>
                  <label>
                    <input type="radio" [(ngModel)]="deliveryInfo.paymentMethod" value="debit">
                    Cartão de Débito
                  </label>
                  <label>
                    <input type="radio" [(ngModel)]="deliveryInfo.paymentMethod" value="pix">
                    PIX
                  </label>
                </ng-container>

                <ng-container *ngIf="deliveryInfo.paymentLocation === 'delivery'">
                  <label>
                    <input type="radio" [(ngModel)]="deliveryInfo.paymentMethod" value="credit">
                    Cartão de Crédito
                  </label>
                  <label>
                    <input type="radio" [(ngModel)]="deliveryInfo.paymentMethod" value="debit">
                    Cartão de Débito
                  </label>
                  <label>
                    <input type="radio" [(ngModel)]="deliveryInfo.paymentMethod" value="pix">
                    PIX
                  </label>
                  <label>
                    <input type="radio" [(ngModel)]="deliveryInfo.paymentMethod" value="cash">
                    Dinheiro
                  </label>
                </ng-container>
              </div>
            </div>

            <div class="change-amount" *ngIf="deliveryInfo.paymentMethod === 'cash'">
              <h3>Troco para quanto?</h3>
              <div class="form-group">
                <input type="number" [(ngModel)]="deliveryInfo.change" placeholder="R$ 0,00">
              </div>
            </div>

            <div class="payment-details" *ngIf="deliveryInfo.paymentMethod === 'credit' || deliveryInfo.paymentMethod === 'debit'">
              <div class="form-group">
                <label>Número do Cartão</label>
                <input type="text" placeholder="0000 0000 0000 0000">
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Validade</label>
                  <input type="text" placeholder="MM/AA">
                </div>
                <div class="form-group">
                  <label>CVV</label>
                  <input type="text" placeholder="123">
                </div>
              </div>
              <div class="form-group">
                <label>Nome no Cartão</label>
                <input type="text" placeholder="Nome como está no cartão">
              </div>
            </div>

            <div class="payment-details" *ngIf="deliveryInfo.paymentMethod === 'pix'">
              <div class="pix-info">
                <img src="https://upload.wikimedia.org/wikipedia/commons/d/de/QR_code_example.png" alt="QR Code PIX">
                <p>Escaneie o QR Code ou copie a chave PIX abaixo:</p>
                <div class="pix-key">
                  <input type="text" value="00000000000" readonly>
                  <button class="copy-btn">Copiar</button>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <div class="total">
              <span>Total a pagar:</span>
              <span>R$ {{total$ | async | number:'1.2-2'}}</span>
            </div>
            <button class="primary-btn" (click)="finishOrder()" 
                    [disabled]="!deliveryInfo.paymentMethod">
              Finalizar Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      padding: 1rem;

      &.active {
        opacity: 1;
        visibility: visible;
      }
    }

    .modal-content {
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      background: #2a2a2a;
      border-radius: 12px;
      overflow: hidden;
      position: relative;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .modal-header {
      display: flex;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;

      h2 {
        flex: 1;
        color: #e84c3d;
        margin: 0;
        text-align: center;
        font-size: 1.5rem;
      }

      .back-btn, .close-btn {
        background: none;
        border: none;
        color: #f5f5f5;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
        transition: color 0.3s ease;
        z-index: 2;

        &:hover {
          color: #e84c3d;
        }
      }

      .back-btn {
        font-size: 1.2rem;
      }
    }

    .modal-body {
      padding: 1.5rem;
      max-height: calc(90vh - 150px);
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }

    .modal-footer {
      padding: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .cart-item {
      display: flex;
      gap: 1rem;
      background: #333;
      padding: 1rem;
      border-radius: 8px;
      position: relative;
      flex-wrap: wrap;

      img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 4px;
      }

      .item-details {
        flex: 1;
        min-width: 200px;

        h3 {
          margin: 0 0 0.5rem 0;
          color: #f5f5f5;
          font-size: 1.1rem;
        }

        .price {
          color: #e84c3d;
          margin: 0 0 0.5rem 0;
        }
      }

      .remove-btn {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: none;
        border: none;
        color: #f5f5f5;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0.5rem;
      }
    }

    .quantity-control {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      button {
        background: #444;
        border: none;
        color: #f5f5f5;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        cursor: pointer;
        min-width: 32px;
        min-height: 32px;
      }

      span {
        color: #f5f5f5;
        min-width: 30px;
        text-align: center;
      }
    }

    .form-group {
      margin-bottom: 1rem;

      label {
        display: block;
        color: #f5f5f5;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
      }

      input {
        width: 100%;
        padding: 0.8rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        background: #333;
        color: #f5f5f5;
        font-size: 1rem;

        &:focus {
          outline: none;
          border-color: #e84c3d;
        }
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
      margin: 1rem 0;

      label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #f5f5f5;
        cursor: pointer;
        font-size: 0.9rem;

        input {
          cursor: pointer;
        }
      }
    }

    .payment-location, .payment-methods {
      margin-bottom: 2rem;

      h3 {
        color: #f5f5f5;
        margin-bottom: 1rem;
        font-size: 1.1rem;
      }
    }

    .pix-info {
      text-align: center;
      padding: 1rem;

      img {
        width: 200px;
        height: 200px;
        margin-bottom: 1rem;
        max-width: 100%;
      }

      p {
        color: #f5f5f5;
        margin-bottom: 1rem;
        font-size: 0.9rem;
      }

      .pix-key {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;

        input {
          flex: 1;
          min-width: 200px;
          padding: 0.8rem;
          background: #333;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          color: #f5f5f5;
        }

        .copy-btn {
          padding: 0.8rem 1.5rem;
          background: #444;
          border: none;
          border-radius: 4px;
          color: #f5f5f5;
          cursor: pointer;
          white-space: nowrap;

          &:hover {
            background: #555;
          }
        }
      }
    }

    .total {
      display: flex;
      align-items: center;
      gap: 1rem;
      color: #f5f5f5;
      font-size: 1.2rem;

      span:last-child {
        color: #e84c3d;
        font-weight: 600;
      }
    }

    .primary-btn {
      background: #e84c3d;
      color: #f5f5f5;
      border: none;
      padding: 0.8rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;

      &:hover {
        background: #d44233;
        transform: translateY(-2px);
      }

      &:disabled {
        background: #666;
        cursor: not-allowed;
        transform: none;
      }
    }

    .empty-cart {
      text-align: center;
      padding: 2rem;
      color: #f5f5f5;

      a {
        color: #e84c3d;
        text-decoration: none;
        margin-top: 1rem;
        display: inline-block;
      }
    }

    @media (max-width: 768px) {
      .modal-content {
        width: 100%;
        height: 100%;
        max-height: 100vh;
        border-radius: 0;
      }

      .modal-overlay {
        padding: 0;
      }

      .modal-header {
        padding: 1rem;

        h2 {
          font-size: 1.3rem;
        }
      }

      .modal-body {
        padding: 1rem;
      }

      .modal-footer {
        padding: 1rem;
      }

      .cart-item {
        padding: 0.8rem;

        img {
          width: 60px;
          height: 60px;
        }

        .item-details {
          h3 {
            font-size: 1rem;
          }
        }
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .total {
        font-size: 1.1rem;
      }

      .primary-btn {
        width: 100%;
        padding: 0.8rem;
        font-size: 1rem;
      }
    }

    @media (max-width: 480px) {
      .cart-item {
        flex-direction: column;
        align-items: center;
        text-align: center;

        img {
          margin-bottom: 0.5rem;
        }

        .item-details {
          width: 100%;
          min-width: auto;
        }

        .quantity-control {
          justify-content: center;
          margin-top: 0.5rem;
        }
      }

      .pix-info {
        img {
          width: 150px;
          height: 150px;
        }
      }

      .modal-footer {
        flex-direction: column;
        gap: 1rem;

        .total {
          width: 100%;
          justify-content: space-between;
        }
      }
    }
  `]
})
export class CartComponent {
  cart$ = this.cartService.cart$;
  total$ = this.cartService.total$;
  isOpen = false;
  currentStep: 'cart' | 'address' | 'payment' = 'cart';
  
  deliveryInfo: DeliveryInfo = {
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    paymentMethod: 'credit',
    paymentLocation: 'online'
  };

  constructor(private cartService: CartService) {}

  updateQuantity(item: CartItem, quantity: number) {
    this.cartService.updateQuantity(item.id, quantity);
  }

  removeItem(item: CartItem) {
    this.cartService.removeFromCart(item.id);
  }

  nextStep() {
    if (this.currentStep === 'cart') {
      this.currentStep = 'address';
    } else if (this.currentStep === 'address') {
      this.currentStep = 'payment';
    }
  }

  finishOrder() {
    const transaction = this.cartService.checkout();
    console.log('Pedido finalizado:', {
      transaction,
      delivery: this.deliveryInfo
    });
    
    alert('Pedido realizado com sucesso!');
    this.close();
  }

  open() {
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpen = false;
    document.body.style.overflow = 'auto';
    this.currentStep = 'cart';
    this.deliveryInfo = {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      paymentMethod: 'credit',
      paymentLocation: 'online'
    };
  }
}