import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from './cart.service';

export interface Transaction {
  id: string;
  items: CartItem[];
  total: number;
  date: Date;
  status: 'pending' | 'completed' | 'cancelled';
}

@Injectable({
  providedIn: 'root'
})
export class FinancialService {
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
  }
}
