import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

export interface Product {
  id?: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private firestore: Firestore) {}

  async addProduct(product: Product): Promise<string> {
    const productsRef = collection(this.firestore, 'products');
    const docRef = await addDoc(productsRef, product);
    return docRef.id;
  }

  async getProducts(): Promise<Product[]> {
    const productsRef = collection(this.firestore, 'products');
    const snapshot = await getDocs(productsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<void> {
    const productRef = doc(this.firestore, 'products', id);
    await updateDoc(productRef, product);
  }

  async deleteProduct(id: string): Promise<void> {
    const productRef = doc(this.firestore, 'products', id);
    await deleteDoc(productRef);
  }
}
