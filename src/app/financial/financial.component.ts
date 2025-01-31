import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinancialService, Transaction } from '../services/financial.service';
import { OrderService } from '../services/order.service';
import { Chart } from 'chart.js/auto';
import { NavbarComponent } from '../components/navbar/navbar.component';

interface FinancialSummary {
  income: number;
  expenses: number;
  profit: number;
}

@Component({
  selector: 'app-financial',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
    <div class="container">
      <app-navbar></app-navbar>
      
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
            <td>{{ transaction.date.toDate() | date:'dd/MM/yyyy HH:mm' }}</td>
            <td [class.income]="transaction.type === 'income'" [class.expense]="transaction.type === 'expense'">
              {{ transaction.type === 'income' ? 'Receita' : 'Despesa' }}
            </td>
            <td>R$ {{ transaction.amount.toFixed(2) }}</td>
            <td>{{ transaction.description }}</td>
            <td>{{ transaction.category }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .card {
      background: #2a2a2a;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

      h3 {
        color: #999;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
      }

      .amount {
        font-size: 1.8rem;
        font-weight: 600;
        margin: 0;

        &.income {
          color: #2ecc71;
        }

        &.expense {
          color: #e74c3c;
        }

        &.profit {
          color: #2ecc71;
        }

        &.loss {
          color: #e74c3c;
        }
      }
    }

    .chart-container {
      background: #2a2a2a;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;

      .btn {
        padding: 0.5rem 1rem;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        font-weight: 500;
        transition: background-color 0.3s;

        &.btn-primary {
          background: #e84c3d;
          color: #fff;

          &:hover {
            background: darken(#e84c3d, 10%);
          }
        }
      }
    }

    .transactions-table {
      width: 100%;
      border-collapse: collapse;
      background: #2a2a2a;
      border-radius: 8px;
      overflow: hidden;

      th, td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #444;
      }

      th {
        background: #333;
        color: #999;
        font-weight: 500;
      }

      td {
        color: #fff;

        &.income {
          color: #2ecc71;
        }

        &.expense {
          color: #e74c3c;
        }
      }

      tbody tr:hover {
        background: #333;
      }
    }

    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }

      .summary-cards {
        grid-template-columns: 1fr;
      }

      .actions {
        flex-direction: column;
      }

      .transactions-table {
        display: block;
        overflow-x: auto;
        white-space: nowrap;
      }
    }
  `]
})
export class FinancialComponent implements OnInit {
  transactions: Transaction[] = [];
  summary: FinancialSummary = {
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
    await this.loadTransactions();
    this.calculateSummary();
    this.createChart();
  }

  private async loadTransactions() {
    try {
      this.transactions = await this.financialService.getTransactions();
      this.transactions.sort((a, b) => b.date.toMillis() - a.date.toMillis());
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    }
  }

  private calculateSummary() {
    this.summary = this.transactions.reduce((acc, transaction) => {
      if (transaction.type === 'income') {
        acc.income += transaction.amount;
      } else {
        acc.expenses += transaction.amount;
      }
      acc.profit = acc.income - acc.expenses;
      return acc;
    }, {
      income: 0,
      expenses: 0,
      profit: 0
    });
  }

  private createChart() {
    const ctx = document.getElementById('financialChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const monthlyData = this.getMonthlyData();

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: monthlyData.labels,
        datasets: [
          {
            label: 'Receitas',
            data: monthlyData.income,
            borderColor: '#2ecc71',
            tension: 0.4
          },
          {
            label: 'Despesas',
            data: monthlyData.expenses,
            borderColor: '#e74c3c',
            tension: 0.4
          }
        ]
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
  }

  private getMonthlyData() {
    const months: { [key: string]: { income: number; expenses: number } } = {};
    
    this.transactions.forEach(transaction => {
      const date = transaction.date.toDate();
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!months[monthKey]) {
        months[monthKey] = { income: 0, expenses: 0 };
      }

      if (transaction.type === 'income') {
        months[monthKey].income += transaction.amount;
      } else {
        months[monthKey].expenses += transaction.amount;
      }
    });

    const sortedMonths = Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6);

    return {
      labels: sortedMonths.map(([month]) => {
        const [year, monthNum] = month.split('-');
        return `${monthNum}/${year}`;
      }),
      income: sortedMonths.map(([_, data]) => data.income),
      expenses: sortedMonths.map(([_, data]) => data.expenses)
    };
  }

  async exportFinancialData() {
    try {
      const transactions = await this.financialService.getTransactions();
      // Implementar exportação
      console.log('Exportando dados financeiros:', transactions);
    } catch (error) {
      console.error('Erro ao exportar dados financeiros:', error);
    }
  }

  async exportOrderData() {
    try {
      await this.orderService.exportToSheet();
      alert('Dados de pedidos exportados com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar dados de pedidos:', error);
      alert('Erro ao exportar dados de pedidos. Tente novamente.');
    }
  }
}
