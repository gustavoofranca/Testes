import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, getDocs, orderBy, Timestamp } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Order {
  id?: string;
  items: any[];
  total: number;
  customerName: string;
  customerPhone: string;
  status: 'pending' | 'preparing' | 'delivered';
  createdAt: Timestamp;
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
      createdAt: Timestamp.now(),
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
    const timestamp = new Date().toISOString().split('T')[0];
    
    link.setAttribute('href', url);
    link.setAttribute('download', `pedidos_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private convertToCSV(orders: Order[]): string {
    const headers = [
      'Data',
      'Cliente',
      'Telefone',
      'Total',
      'Status',
      'Método de Pagamento',
      'Itens'
    ];

    const rows = orders.map(order => [
      order.createdAt.toDate().toLocaleString(),
      order.customerName,
      order.customerPhone,
      order.total.toFixed(2),
      order.status,
      order.paymentMethod,
      order.items.map(item => `${item.name} (${item.quantity}x)`).join(', ')
    ]);

    return [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
  }
}
