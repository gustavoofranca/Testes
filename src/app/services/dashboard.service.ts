import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Order {
  id: string;
  productName: string;
  status: 'pending' | 'completed' | 'cancelled';
  price: number;
  cost: number;
  quantity: number;
  date: Date;
  paymentMethod: 'credit' | 'debit' | 'pix' | 'cash';
}

export interface ProductPerformance {
  productName: string;
  totalSales: number;
  totalQuantity: number;
  averagePrice: number;
  totalCost: number;
  profitMargin: number;
  popularity: number;
}

export interface FinancialMetrics {
  dailyRevenue: number[];
  monthlyRevenue: number[];
  yearlyRevenue: number[];
  averageOrderValue: number;
  topProducts: ProductPerformance[];
  paymentMethodDistribution: Record<string, number>;
  operationalCosts: {
    ingredients: number;
    labor: number;
    utilities: number;
    rent: number;
    marketing: number;
    other: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private orders: Order[] = [
    {
      id: '1',
      productName: 'X-Burguer',
      status: 'completed',
      price: 25.50,
      cost: 10.20,
      quantity: 1,
      date: new Date('2024-01-15'),
      paymentMethod: 'credit'
    },
    {
      id: '2',
      productName: 'X-Bacon',
      status: 'completed',
      price: 28.50,
      cost: 12.80,
      quantity: 2,
      date: new Date('2024-01-15'),
      paymentMethod: 'pix'
    },
    // Mais pedidos simulados...
  ];

  private ordersSubject = new BehaviorSubject<Order[]>(this.orders);

  getOrders() {
    return this.ordersSubject.asObservable();
  }

  getStats() {
    const totalSales = this.calculateTotalSales();
    const totalCost = this.calculateTotalCosts();
    const netProfit = totalSales - totalCost;
    const orderCounts = this.calculateOrderCounts();
    const completionRates = this.calculateCompletionRates();
    const financialMetrics = this.calculateFinancialMetrics();

    return {
      totalSales,
      totalCost,
      netProfit,
      orderCounts,
      completionRates,
      totalOrders: this.orders.length,
      financialMetrics
    };
  }

  private calculateTotalSales(): number {
    return this.orders.reduce((sum, order) => sum + (order.price * order.quantity), 0);
  }

  private calculateTotalCosts(): number {
    const operationalCosts = {
      ingredients: 2000,
      labor: 3000,
      utilities: 800,
      rent: 1500,
      marketing: 500,
      other: 200
    };

    const productCosts = this.orders.reduce((sum, order) => sum + (order.cost * order.quantity), 0);
    
    return productCosts + Object.values(operationalCosts).reduce((a, b) => a + b, 0);
  }

  private calculateOrderCounts(): Record<string, number> {
    return this.orders.reduce((acc, order) => {
      acc[order.productName] = (acc[order.productName] || 0) + order.quantity;
      return acc;
    }, {} as Record<string, number>);
  }

  private calculateCompletionRates(): Record<string, number> {
    const ordersByProduct = this.orders.reduce((acc, order) => {
      if (!acc[order.productName]) {
        acc[order.productName] = { total: 0, completed: 0 };
      }
      acc[order.productName].total += order.quantity;
      if (order.status === 'completed') {
        acc[order.productName].completed += order.quantity;
      }
      return acc;
    }, {} as Record<string, { total: number; completed: number }>);

    return Object.entries(ordersByProduct).reduce((acc, [product, stats]) => {
      acc[product] = (stats.completed / stats.total) * 100;
      return acc;
    }, {} as Record<string, number>);
  }

  private calculateFinancialMetrics(): FinancialMetrics {
    const now = new Date();
    const dailyRevenue = Array(30).fill(0);
    const monthlyRevenue = Array(12).fill(0);
    const yearlyRevenue = Array(5).fill(0);

    // Calcula receita por período
    this.orders.forEach(order => {
      const dayDiff = Math.floor((now.getTime() - order.date.getTime()) / (1000 * 60 * 60 * 24));
      if (dayDiff < 30) {
        dailyRevenue[dayDiff] += order.price * order.quantity;
      }

      const monthDiff = (now.getMonth() - order.date.getMonth()) + 
        (now.getFullYear() - order.date.getFullYear()) * 12;
      if (monthDiff < 12) {
        monthlyRevenue[monthDiff] += order.price * order.quantity;
      }

      const yearDiff = now.getFullYear() - order.date.getFullYear();
      if (yearDiff < 5) {
        yearlyRevenue[yearDiff] += order.price * order.quantity;
      }
    });

    // Calcula métricas por produto
    const productStats = this.orders.reduce((acc, order) => {
      if (!acc[order.productName]) {
        acc[order.productName] = {
          totalSales: 0,
          totalQuantity: 0,
          totalCost: 0,
          totalRevenue: 0
        };
      }
      
      acc[order.productName].totalSales++;
      acc[order.productName].totalQuantity += order.quantity;
      acc[order.productName].totalCost += order.cost * order.quantity;
      acc[order.productName].totalRevenue += order.price * order.quantity;
      
      return acc;
    }, {} as Record<string, any>);

    const topProducts: ProductPerformance[] = Object.entries(productStats)
      .map(([productName, stats]) => ({
        productName,
        totalSales: stats.totalSales,
        totalQuantity: stats.totalQuantity,
        averagePrice: stats.totalRevenue / stats.totalQuantity,
        totalCost: stats.totalCost,
        profitMargin: ((stats.totalRevenue - stats.totalCost) / stats.totalRevenue) * 100,
        popularity: (stats.totalQuantity / this.orders.reduce((sum, o) => sum + o.quantity, 0)) * 100
      }))
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 5);

    // Distribuição de métodos de pagamento
    const paymentMethodDistribution = this.orders.reduce((acc, order) => {
      acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      dailyRevenue,
      monthlyRevenue,
      yearlyRevenue,
      averageOrderValue: this.calculateTotalSales() / this.orders.length,
      topProducts,
      paymentMethodDistribution,
      operationalCosts: {
        ingredients: 2000,
        labor: 3000,
        utilities: 800,
        rent: 1500,
        marketing: 500,
        other: 200
      }
    };
  }
}