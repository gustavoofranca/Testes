import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService, ProductPerformance } from '../services/dashboard.service';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats = {
    totalSales: 0,
    totalCost: 0,
    netProfit: 0,
    totalOrders: 0
  };

  ordersList: { name: string; count: number }[] = [];
  completionRates: { name: string; percentage: number }[] = [];
  topProducts: ProductPerformance[] = [];
  revenueChart: any;
  costDistributionChart: any;
  paymentMethodsChart: any;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    const stats = this.dashboardService.getStats();
    this.stats = {
      totalSales: stats.totalSales,
      totalCost: stats.totalCost,
      netProfit: stats.netProfit,
      totalOrders: stats.totalOrders
    };

    this.ordersList = Object.entries(stats.orderCounts).map(([name, count]) => ({
      name,
      count
    }));

    this.completionRates = Object.entries(stats.completionRates).map(([name, percentage]) => ({
      name,
      percentage
    }));

    this.topProducts = stats.financialMetrics.topProducts;

    this.initializeCharts(stats.financialMetrics);
  }

  private initializeCharts(metrics: any) {
    // Gráfico de Receita
    const revenueCtx = document.getElementById('revenueChart') as HTMLCanvasElement;
    this.revenueChart = new Chart(revenueCtx, {
      type: 'line',
      data: {
        labels: Array(30).fill(0).map((_, i) => `Dia ${i + 1}`),
        datasets: [{
          label: 'Receita Diária',
          data: metrics.dailyRevenue,
          borderColor: '#e84c3d',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#f5f5f5'
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#f5f5f5'
            }
          },
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#f5f5f5'
            }
          }
        }
      }
    });

    // Gráfico de Distribuição de Custos
    const costCtx = document.getElementById('costDistributionChart') as HTMLCanvasElement;
    this.costDistributionChart = new Chart(costCtx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(metrics.operationalCosts),
        datasets: [{
          data: Object.values(metrics.operationalCosts),
          backgroundColor: [
            '#e84c3d',
            '#3498db',
            '#2ecc71',
            '#f1c40f',
            '#9b59b6',
            '#e67e22'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#f5f5f5'
            }
          }
        }
      }
    });

    // Gráfico de Métodos de Pagamento
    const paymentCtx = document.getElementById('paymentMethodsChart') as HTMLCanvasElement;
    this.paymentMethodsChart = new Chart(paymentCtx, {
      type: 'pie',
      data: {
        labels: Object.keys(metrics.paymentMethodDistribution),
        datasets: [{
          data: Object.values(metrics.paymentMethodDistribution),
          backgroundColor: [
            '#e84c3d',
            '#3498db',
            '#2ecc71',
            '#f1c40f'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#f5f5f5'
            }
          }
        }
      }
    });
  }
}