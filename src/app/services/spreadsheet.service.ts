import { Injectable } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { InventoryService } from './inventory.service';

@Injectable({
  providedIn: 'root'
})
export class SpreadsheetService {
  constructor(
    private dashboardService: DashboardService,
    private inventoryService: InventoryService
  ) {}

  exportFinancialData(): void {
    const stats = this.dashboardService.getStats();
    const data = [
      ['Relatório Financeiro'],
      ['Data de Geração', new Date().toLocaleString()],
      [],
      ['Métricas Principais'],
      ['Total de Vendas', `R$ ${stats.totalSales.toFixed(2)}`],
      ['Custo Total', `R$ ${stats.totalCost.toFixed(2)}`],
      ['Lucro Líquido', `R$ ${stats.netProfit.toFixed(2)}`],
      ['Total de Pedidos', stats.totalOrders],
      [],
      ['Desempenho por Produto'],
      ['Produto', 'Quantidade Vendida', 'Preço Médio', 'Margem de Lucro', 'Popularidade']
    ];

    // Adicionar dados dos produtos
    stats.financialMetrics.topProducts.forEach(product => {
      data.push([
        product.productName,
        product.totalQuantity.toString(),
        `R$ ${product.averagePrice.toFixed(2)}`,
        `${product.profitMargin.toFixed(1)}%`,
        `${product.popularity.toFixed(1)}%`
      ]);
    });

    this.downloadCSV(data, 'relatorio-financeiro.csv');
  }

  exportInventoryData(): void {
    this.inventoryService.getIngredients().subscribe(categories => {
      const data = [
        ['Relatório de Estoque'],
        ['Data de Geração', new Date().toLocaleString()],
        [],
        ['Categoria', 'Ingrediente', 'Quantidade Atual', 'Quantidade Mínima', 'Status']
      ];

      categories.forEach(category => {
        category.ingredients.forEach(ingredient => {
          const status = ingredient.quantity <= ingredient.minQuantity ? 'BAIXO' : 'OK';
          data.push([
            category.name,
            ingredient.name,
            `${ingredient.quantity} ${ingredient.unit}`,
            `${ingredient.minQuantity} ${ingredient.unit}`,
            status
          ]);
        });
      });

      this.downloadCSV(data, 'relatorio-estoque.csv');
    });
  }

  private downloadCSV(data: any[][], filename: string): void {
    let csvContent = '\uFEFF'; // BOM para caracteres especiais
    
    data.forEach(row => {
      csvContent += row.map(cell => {
        // Escapar aspas e adicionar aspas se necessário
        const cellStr = cell.toString();
        return cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')
          ? `"${cellStr.replace(/"/g, '""')}"`
          : cellStr;
      }).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}