import { Injectable } from '@angular/core';
<<<<<<< HEAD
import { Firestore, collection, addDoc, query, getDocs, orderBy, where, Timestamp } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

export interface Transaction {
  id?: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: Timestamp;
  orderId?: string;
=======
import { BehaviorSubject } from 'rxjs';
import { CartItem } from './cart.service';

export interface Transaction {
  id: string;
  items: CartItem[];
  total: number;
  date: Date;
  status: 'pending' | 'completed' | 'cancelled';
>>>>>>> 9f22a7ca0676d42b7aa3b78ebeead85e78aa05cb
}

@Injectable({
  providedIn: 'root'
})
export class FinancialService {
<<<<<<< HEAD
  constructor(private firestore: Firestore) {}

  async addTransaction(transaction: Omit<Transaction, 'id'>) {
    const transactionsRef = collection(this.firestore, 'transactions');
    return addDoc(transactionsRef, transaction);
  }

  async getTransactions(startDate?: Date, endDate?: Date) {
    const transactionsRef = collection(this.firestore, 'transactions');
    let q = query(transactionsRef, orderBy('date', 'desc'));
    
    if (startDate && endDate) {
      q = query(q, 
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(endDate))
      );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Transaction));
  }

  async getFinancialSummary(startDate?: Date, endDate?: Date) {
    const transactions = await this.getTransactions(startDate, endDate);
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      income,
      expenses,
      profit: income - expenses
    };
  }

  async exportToSheet() {
    const transactions = await this.getTransactions();
    const csvContent = this.convertToCSV(transactions);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'financeiro.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private convertToCSV(transactions: Transaction[]): string {
    const headers = ['ID', 'Data', 'Tipo', 'Valor', 'Descrição', 'Categoria', 'ID do Pedido'];
    const rows = transactions.map(transaction => [
      transaction.id,
      transaction.date.toDate().toLocaleString(),
      transaction.type === 'income' ? 'Receita' : 'Despesa',
      transaction.amount.toFixed(2),
      transaction.description,
      transaction.category,
      transaction.orderId || ''
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
=======
  private transactions: Transaction[] = [];
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);

  transactions$ = this.transactionsSubject.asObservable();

  createTransaction(items: CartItem[], total: number): Transaction {
    const transaction: Transaction = {
      id: Date.now().toString(),
      items: [...items],
      total,
      date: new Date(),
      status: 'pending'
    };

    this.transactions.push(transaction);
    this.updateTransactions();
    return transaction;
  }

  updateTransactionStatus(transactionId: string, status: 'pending' | 'completed' | 'cancelled') {
    const transaction = this.transactions.find(t => t.id === transactionId);
    if (transaction) {
      transaction.status = status;
      this.updateTransactions();
    }
  }

  getTransactions() {
    return [...this.transactions];
  }

  private updateTransactions() {
    this.transactionsSubject.next([...this.transactions]);
>>>>>>> 9f22a7ca0676d42b7aa3b78ebeead85e78aa05cb
  }
}
