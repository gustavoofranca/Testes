import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, getDocs, orderBy } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Order {
  id?: string;
  items: any[];
  total: number;
  customerName: string;
  customerPhone: string;
  status: 'pending' | 'preparing' | 'delivered';
  createdAt: Date;
  paymentMethod: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private firestore: Firestore) {}

  async createOrder(order: Omit<Order, 'id' | 'createdAt'>) {
    const ordersRef = collection(this.firestore, 'orders');
    const newOrder = {
      ...order,
      createdAt: new Date(),
      status: 'pending'
    };
    return addDoc(ordersRef, newOrder);
  }

  async getOrders() {
    const ordersRef = collection(this.firestore, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));
  }

  async exportToSheet() {
    const orders = await this.getOrders();
    const csvContent = this.convertToCSV(orders);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'pedidos.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private convertToCSV(orders: Order[]): string {
    const headers = ['ID', 'Data', 'Cliente', 'Telefone', 'Total', 'Status', 'Método de Pagamento', 'Itens'];
    const rows = orders.map(order => [
      order.id,
      order.createdAt.toLocaleString(),
      order.customerName,
      order.customerPhone,
      order.total.toFixed(2),
      order.status,
      order.paymentMethod,
      order.items.map(item => `${item.name}(${item.quantity})`).join('; ')
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}
