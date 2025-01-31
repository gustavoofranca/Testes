import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinancialService, Transaction } from '../services/financial.service';
import { OrderService } from '../services/order.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-financial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Financeiro</h2>
      
      <div class="summary-cards">
        <div class="card">
          <h3>Receitas</h3>
          <p class="amount income">R$ {{summary.income.toFixed(2)}}</p>
        </div>
        <div class="card">
          <h3>Despesas</h3>
          <p class="amount expense">R$ {{summary.expenses.toFixed(2)}}</p>
        </div>
        <div class="card">
          <h3>Lucro</h3>
          <p class="amount" [class.profit]="summary.profit >= 0" [class.loss]="summary.profit < 0">
            R$ {{summary.profit.toFixed(2)}}
          </p>
        </div>
      </div>

      <div class="chart-container">
        <canvas id="financialChart"></canvas>
      </div>

      <div class="actions">
        <button (click)="exportFinancialData()" class="btn btn-primary">
          Exportar Dados Financeiros
        </button>
        <button (click)="exportOrderData()" class="btn btn-primary">
          Exportar Dados de Pedidos
        </button>
      </div>

      <table class="transactions-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Descrição</th>
            <th>Categoria</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let transaction of transactions">
            <td>{{transaction.date.toLocaleDateString()}}</td>
            <td>{{transaction.type === 'income' ? 'Receita' : 'Despesa'}}</td>
            <td [class.income]="transaction.type === 'income'"
                [class.expense]="transaction.type === 'expense'">
              R$ {{transaction.amount.toFixed(2)}}
            </td>
            <td>{{transaction.description}}</td>
            <td>{{transaction.category}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .card {
      padding: 20px;
      border-radius: 8px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .amount {
      font-size: 24px;
      font-weight: bold;
    }

    .income { color: #28a745; }
    .expense { color: #dc3545; }
    .profit { color: #28a745; }
    .loss { color: #dc3545; }

    .chart-container {
      margin: 30px 0;
      height: 400px;
    }

    .actions {
      margin: 20px 0;
      display: flex;
      gap: 10px;
    }

    .transactions-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    .transactions-table th,
    .transactions-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    .transactions-table th {
      background-color: #f8f9fa;
    }
  `]
})
export class FinancialComponent implements OnInit {
  transactions: Transaction[] = [];
  summary = {
    income: 0,
    expenses: 0,
    profit: 0
  };
  chart: Chart | null = null;

  constructor(
    private financialService: FinancialService,
    private orderService: OrderService
  ) {}

  async ngOnInit() {
    await this.loadData();
    this.createChart();
  }

  async loadData() {
    this.transactions = await this.financialService.getTransactions();
    this.summary = await this.financialService.getFinancialSummary();
  }

  createChart() {
    const ctx = document.getElementById('financialChart') as HTMLCanvasElement;
    if (!ctx) return;

    const monthlyData = this.getMonthlyData();

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: monthlyData.labels,
        datasets: [
          {
            label: 'Receitas',
            data: monthlyData.income,
            borderColor: '#28a745',
            tension: 0.1
          },
          {
            label: 'Despesas',
            data: monthlyData.expenses,
            borderColor: '#dc3545',
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  getMonthlyData() {
    const months: { [key: string]: { income: number, expenses: number } } = {};
    
    this.transactions.forEach(transaction => {
      const monthKey = transaction.date.toISOString().slice(0, 7);
      if (!months[monthKey]) {
        months[monthKey] = { income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'income') {
        months[monthKey].income += transaction.amount;
      } else {
        months[monthKey].expenses += transaction.amount;
      }
    });

    const sortedMonths = Object.keys(months).sort();

    return {
      labels: sortedMonths.map(month => {
        const [year, monthNum] = month.split('-');
        return `${monthNum}/${year}`;
      }),
      income: sortedMonths.map(month => months[month].income),
      expenses: sortedMonths.map(month => months[month].expenses)
    };
  }

  async exportFinancialData() {
    await this.financialService.exportToSheet();
  }

  async exportOrderData() {
    await this.orderService.exportToSheet();
  }
}
