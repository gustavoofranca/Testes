import { Injectable } from '@angular/core';
<<<<<<< HEAD
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
=======
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, collectionData, query, where } from '@angular/fire/firestore';
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
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
>>>>>>> 9f22a7ca0676d42b7aa3b78ebeead85e78aa05cb
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private firestore: Firestore) {}

<<<<<<< HEAD
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
=======
  // Criar um novo pedido
  async createOrder(order: Omit<Order, 'id'>) {
    const ordersRef = collection(this.firestore, 'orders');
    return addDoc(ordersRef, {
      ...order,
      status: 'in_progress',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  // Obter todos os pedidos
  getAllOrders(): Observable<Order[]> {
    const ordersRef = collection(this.firestore, 'orders');
    return collectionData(ordersRef, { idField: 'id' }) as Observable<Order[]>;
  }

  // Obter pedidos por status
  getOrdersByStatus(status: OrderStatus): Observable<Order[]> {
    const ordersRef = collection(this.firestore, 'orders');
    const q = query(ordersRef, where('status', '==', status));
    return collectionData(q, { idField: 'id' }) as Observable<Order[]>;
  }

  // Obter pedidos do usuário por status
  getUserOrdersByStatus(userId: string, status: OrderStatus): Observable<Order[]> {
    const ordersRef = collection(this.firestore, 'orders');
    const q = query(ordersRef, 
      where('userId', '==', userId),
      where('status', '==', status)
    );
    return collectionData(q, { idField: 'id' }) as Observable<Order[]>;
  }

  // Obter pedidos do usuário
  getUserOrders(userId: string): Observable<Order[]> {
    const ordersRef = collection(this.firestore, 'orders');
    const q = query(ordersRef, where('userId', '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<Order[]>;
  }

  // Atualizar status do pedido
  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const orderRef = doc(this.firestore, `orders/${orderId}`);
    return updateDoc(orderRef, { 
      status,
      updatedAt: new Date()
    });
  }

  // Cancelar pedido
  async cancelOrder(orderId: string) {
    return this.updateOrderStatus(orderId, 'canceled');
  }

  // Marcar pedido como em entrega
  async markAsDelivering(orderId: string) {
    return this.updateOrderStatus(orderId, 'delivering');
  }

  // Marcar pedido como entregue
  async markAsDelivered(orderId: string) {
    return this.updateOrderStatus(orderId, 'delivered');
>>>>>>> 9f22a7ca0676d42b7aa3b78ebeead85e78aa05cb
  }
}
