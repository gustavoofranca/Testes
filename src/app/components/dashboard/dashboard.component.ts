import { Component, OnInit } from '@angular/core';
import { DashboardService, ProductPerformance } from '../../services/dashboard.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
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

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadStats();
    this.loadCharts();
  }

  private async loadStats() {
    try {
      this.stats = await this.dashboardService.getStats();
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  private async loadCharts() {
    try {
      const salesData = await this.dashboardService.getSalesData();
      const productPerformance = await this.dashboardService.getProductPerformance();
      
      this.createSalesChart(salesData);
      this.createProductPerformanceChart(productPerformance);
    } catch (error) {
      console.error('Error loading charts:', error);
    }
  }

  private createSalesChart(salesData: any) {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: salesData.map((data: any) => data.date),
        datasets: [{
          label: 'Vendas Diárias',
          data: salesData.map((data: any) => data.amount),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  private createProductPerformanceChart(productPerformance: ProductPerformance[]) {
    const ctx = document.getElementById('productChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: productPerformance.map(product => product.name),
        datasets: [{
          label: 'Vendas por Produto',
          data: productPerformance.map(product => product.sales),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}