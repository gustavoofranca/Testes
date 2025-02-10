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
  public OrderStatus = OrderStatus;

  canceledOrders$: Observable<Order[]>;
  inProgressOrders$: Observable<Order[]>;
  deliveringOrders$: Observable<Order[]>;
  deliveredOrders$: Observable<Order[]>;
  isAdmin$ = this.authService.isAdmin$;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {
    this.canceledOrders$ = this.orderService.getOrdersByStatus(OrderStatus.canceled);
    this.inProgressOrders$ = this.orderService.getOrdersByStatus(OrderStatus.in_progress);
    this.deliveringOrders$ = this.orderService.getOrdersByStatus(OrderStatus.delivering);
    this.deliveredOrders$ = this.orderService.getOrdersByStatus(OrderStatus.delivered);
  }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.isAdmin$.subscribe(isAdmin => {
          if (!isAdmin) {
            // Se não for admin, mostrar apenas os pedidos do usuário
            this.canceledOrders$ = this.orderService.getUserOrdersByStatus(user.uid, OrderStatus.canceled);
            this.inProgressOrders$ = this.orderService.getUserOrdersByStatus(user.uid, OrderStatus.in_progress);
            this.deliveringOrders$ = this.orderService.getUserOrdersByStatus(user.uid, OrderStatus.delivering);
            this.deliveredOrders$ = this.orderService.getUserOrdersByStatus(user.uid, OrderStatus.delivered);
          }
        });
      }
    });
  }

  private statusMap: Record<OrderStatus, string> = {
    [OrderStatus.pending]: 'Pendente',
    [OrderStatus.processing]: 'Processando',
    [OrderStatus.delivering]: 'Em Entrega',
    [OrderStatus.delivered]: 'Entregue',
    [OrderStatus.canceled]: 'Cancelado',
    [OrderStatus.in_progress]: 'Em Progresso'
  };

  private classMap: Record<OrderStatus, string> = {
    [OrderStatus.pending]: 'bg-warning',
    [OrderStatus.processing]: 'bg-info',
    [OrderStatus.delivering]: 'bg-primary',
    [OrderStatus.delivered]: 'bg-success',
    [OrderStatus.canceled]: 'bg-danger',
    [OrderStatus.in_progress]: 'bg-secondary'
  };

  getStatusText(status: OrderStatus): string {
    return this.statusMap[status];
  }

  getStatusClass(status: OrderStatus): string {
    return this.classMap[status];
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

  async cancelOrder(orderId: string) {
    await this.orderService.deleteOrder(orderId);
  }

  calculateOrderTotal(order: Order): number {
    return order.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }
}
