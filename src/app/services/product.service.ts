import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  available: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsCollection: AngularFirestoreCollection<Product>;

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.productsCollection = this.firestore.collection<Product>('products');
  }

  // Obter todos os produtos
  getProducts(): Observable<Product[]> {
    return this.productsCollection.valueChanges({ idField: 'id' });
  }

  // Adicionar novo produto
  async addProduct(product: Omit<Product, 'id'>, imageFile: File) {
    const filePath = `products/${new Date().getTime()}_${imageFile.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, imageFile);

    try {
      await task;
      const imageUrl = await fileRef.getDownloadURL().toPromise();
      return this.productsCollection.add({
        ...product,
        imageUrl,
        available: true
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // Atualizar produto
  async updateProduct(productId: string, updates: Partial<Product>, newImageFile?: File) {
    if (newImageFile) {
      const filePath = `products/${new Date().getTime()}_${newImageFile.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, newImageFile);

      try {
        await task;
        const imageUrl = await fileRef.getDownloadURL().toPromise();
        return this.productsCollection.doc(productId).update({ ...updates, imageUrl });
      } catch (error) {
        console.error('Error uploading new image:', error);
        throw error;
      }
    }

    return this.productsCollection.doc(productId).update(updates);
  }

  // Excluir produto
  async deleteProduct(productId: string, imageUrl: string) {
    try {
      // Excluir imagem do storage
      const imageRef = this.storage.refFromURL(imageUrl);
      await imageRef.delete().toPromise();
      
      // Excluir documento do produto
      return this.productsCollection.doc(productId).delete();
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}
