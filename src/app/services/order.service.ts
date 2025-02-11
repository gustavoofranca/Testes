import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from './product.service';

export interface OrderItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'canceled' | 'in_progress' | 'delivering' | 'delivered';

export interface Order {
  id?: string;
  userId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  createdAt: any;
  updatedAt: any;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersCollection: AngularFirestoreCollection<Order>;

  constructor(private firestore: AngularFirestore) {
    this.ordersCollection = this.firestore.collection<Order>('orders');
  }

  getOrdersByStatus(status: OrderStatus): Observable<Order[]> {
    return this.firestore.collection<Order>('orders', ref => 
      ref.where('status', '==', status)
    ).valueChanges({ idField: 'id' });
  }

  getUserOrdersByStatus(userId: string, status: OrderStatus): Observable<Order[]> {
    return this.firestore.collection<Order>('orders', ref => 
      ref.where('userId', '==', userId)
       .where('status', '==', status)
    ).valueChanges({ idField: 'id' });
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    return this.ordersCollection.doc(orderId).update({ 
      status,
      updatedAt: new Date()
    });
  }

  async deleteOrder(orderId: string) {
    return this.ordersCollection.doc(orderId).delete();
  }

  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
    const newOrder = {
      ...order,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return this.ordersCollection.add(newOrder);
  }

  getAllOrders(): Observable<Order[]> {
    return this.ordersCollection.valueChanges({ idField: 'id' });
  }

  async exportToSheet(): Promise<void> {
    try {
      const snapshot = await this.ordersCollection.get().toPromise();
      const orders = snapshot?.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) || [];

      const headers = ['ID', 'Cliente', 'Total', 'Status', 'Data', 'Método de Pagamento'];
      const csvContent = [
        headers.join(','),
        ...orders.map(order => [
          order.id,
          order.customerName,
          order.total.toFixed(2),
          order.status,
          order.createdAt.toDate().toLocaleString(),
          order.paymentMethod
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `pedidos_${new Date().toISOString()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting orders:', error);
      throw error;
    }
  }
}
