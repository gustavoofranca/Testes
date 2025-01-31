import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrderService, Order, OrderStatus } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  canceledOrders$: Observable<Order[]>;
  inProgressOrders$: Observable<Order[]>;
  deliveringOrders$: Observable<Order[]>;
  deliveredOrders$: Observable<Order[]>;
  isAdmin$ = this.authService.isAdmin$;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {
    this.canceledOrders$ = this.orderService.getOrdersByStatus('canceled');
    this.inProgressOrders$ = this.orderService.getOrdersByStatus('in_progress');
    this.deliveringOrders$ = this.orderService.getOrdersByStatus('delivering');
    this.deliveredOrders$ = this.orderService.getOrdersByStatus('delivered');
  }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.isAdmin$.subscribe(isAdmin => {
          if (!isAdmin) {
            // Se não for admin, mostrar apenas os pedidos do usuário
            this.canceledOrders$ = this.orderService.getUserOrdersByStatus(user.uid, 'canceled');
            this.inProgressOrders$ = this.orderService.getUserOrdersByStatus(user.uid, 'in_progress');
            this.deliveringOrders$ = this.orderService.getUserOrdersByStatus(user.uid, 'delivering');
            this.deliveredOrders$ = this.orderService.getUserOrdersByStatus(user.uid, 'delivered');
          }
        });
      }
    });
  }

  getStatusText(status: OrderStatus): string {
    const statusMap = {
      'canceled': 'Cancelado',
      'in_progress': 'Em Andamento',
      'delivering': 'Em Entrega',
      'delivered': 'Entregue'
    };
    return statusMap[status];
  }

  getStatusClass(status: OrderStatus): string {
    const classMap = {
      'canceled': 'status-canceled',
      'in_progress': 'status-in-progress',
      'delivering': 'status-delivering',
      'delivered': 'status-delivered'
    };
    return classMap[status];
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    try {
      await this.orderService.updateOrderStatus(orderId, status);
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
    }
  }

  async deleteOrder(orderId: string) {
    try {
      await this.orderService.deleteOrder(orderId);
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
    }
  }

  calculateOrderTotal(order: Order): number {
    return order.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }
}
