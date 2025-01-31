import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, getDocs, orderBy, where } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

export interface Transaction {
  id?: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: Date;
  orderId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FinancialService {
  constructor(private firestore: Firestore) {}

  async addTransaction(transaction: Omit<Transaction, 'id'>) {
    const transactionsRef = collection(this.firestore, 'transactions');
    return addDoc(transactionsRef, {
      ...transaction,
      date: new Date(transaction.date)
    });
  }

  async getTransactions(startDate?: Date, endDate?: Date) {
    const transactionsRef = collection(this.firestore, 'transactions');
    let q = query(transactionsRef, orderBy('date', 'desc'));
    
    if (startDate && endDate) {
      q = query(q, 
        where('date', '>=', startDate),
        where('date', '<=', endDate)
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
      transaction.date.toLocaleString(),
      transaction.type === 'income' ? 'Receita' : 'Despesa',
      transaction.amount.toFixed(2),
      transaction.description,
      transaction.category,
      transaction.orderId || ''
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}
