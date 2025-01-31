import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService, Order } from '../services/order.service';
import { Chart } from 'chart.js/auto';
import { Subscription } from 'rxjs';

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  averageTicket: number;
  profit: number;
  pendingOrders: number;
  deliveredOrders: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStats = {
    totalSales: 0,
    totalOrders: 0,
    averageTicket: 0,
    profit: 0,
    pendingOrders: 0,
    deliveredOrders: 0
  };

  recentOrders: Order[] = [];
  dateFilter: 'today' | 'week' | 'month' | 'year' = 'today';
  private subscriptions: Subscription[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.updateData();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  async updateData() {
    const orders = await this.orderService.getOrders();
    const filteredOrders = this.filterOrdersByDate(orders);
    
    this.recentOrders = filteredOrders.slice(0, 10);
    this.calculateStats(filteredOrders);
    this.updateCharts(filteredOrders);
  }

  private filterOrdersByDate(orders: Order[]): Order[] {
    const now = new Date();
    const startDate = new Date();

    switch (this.dateFilter) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return orders.filter(order => {
      const orderDate = order.createdAt.toDate();
      return orderDate >= startDate;
    });
  }

  private calculateStats(orders: Order[]) {
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    
    this.stats = {
      totalSales,
      totalOrders,
      averageTicket: totalOrders > 0 ? totalSales / totalOrders : 0,
      profit: totalSales * 0.3, // 30% de lucro estimado
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      deliveredOrders: orders.filter(o => o.status === 'delivered').length
    };
  }

  private updateCharts(orders: Order[]) {
    // Implementar gráficos com Chart.js
    // Será implementado em seguida
  }

  async exportToSheets() {
    try {
      await this.orderService.exportToSheet();
      alert('Dados exportados com sucesso! Verifique seus downloads.');
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      alert('Erro ao exportar dados. Tente novamente.');
    }
  }
}