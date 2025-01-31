import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { OrderService, Order } from '../services/order.service';
import { Chart } from 'chart.js/auto';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

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
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FormsModule],
  template: `
    <div class="dashboard-container">
      <app-navbar></app-navbar>
      
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Vendas Totais</h3>
          <p>R$ {{ stats.totalSales.toFixed(2) }}</p>
        </div>
        <div class="stat-card">
          <h3>Total de Pedidos</h3>
          <p>{{ stats.totalOrders }}</p>
        </div>
        <div class="stat-card">
          <h3>Ticket Médio</h3>
          <p>R$ {{ stats.averageTicket.toFixed(2) }}</p>
        </div>
        <div class="stat-card">
          <h3>Lucro</h3>
          <p>R$ {{ stats.profit.toFixed(2) }}</p>
        </div>
      </div>

      <div class="charts-grid">
        <div class="chart-container">
          <h3>Vendas por Período</h3>
          <canvas #salesChart></canvas>
        </div>
        <div class="chart-container">
          <h3>Produtos Mais Vendidos</h3>
          <canvas #productsChart></canvas>
        </div>
      </div>

      <div class="orders-section">
        <div class="section-header">
          <h3>Pedidos Recentes</h3>
          <div class="actions">
            <select [(ngModel)]="dateFilter" (change)="updateData()">
              <option value="today">Hoje</option>
              <option value="week">Última Semana</option>
              <option value="month">Último Mês</option>
              <option value="year">Último Ano</option>
            </select>
            <button class="export-btn" (click)="exportToSheets()">
              Exportar para Planilha
            </button>
          </div>
        </div>
        
        <table class="orders-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Status</th>
              <th>Pagamento</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let order of recentOrders">
              <td>{{ order.createdAt.toDate() | date:'dd/MM/yyyy HH:mm' }}</td>
              <td>{{ order.customerName }}</td>
              <td>R$ {{ order.total.toFixed(2) }}</td>
              <td>
                <span [class]="'status-' + order.status">
                  {{ order.status }}
                </span>
              </td>
              <td>{{ order.paymentMethod }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
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