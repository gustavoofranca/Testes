import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, collectionData } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';
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
  constructor(
    private firestore: Firestore,
    private storage: Storage
  ) {}

  // Obter todos os produtos
  getProducts(): Observable<Product[]> {
    const productsRef = collection(this.firestore, 'products');
    return collectionData(productsRef, { idField: 'id' }) as Observable<Product[]>;
  }

  // Adicionar novo produto
  async addProduct(product: Omit<Product, 'id'>, imageFile: File): Promise<string> {
    const productId = doc(collection(this.firestore, 'products')).id;
    const imageUrl = await this.uploadProductImage(imageFile, productId);
    const docRef = await addDoc(collection(this.firestore, 'products'), { ...product, imageUrl, id: productId });
    return docRef.id;
  }

  // Atualizar produto
  async updateProduct(productId: string, updates: Partial<Product>, newImageFile?: File) {
    const productRef = doc(this.firestore, `products/${productId}`);
    
    if (newImageFile) {
      // Upload da nova imagem
      const storageRef = ref(this.storage, `products/${newImageFile.name}`);
      const snapshot = await uploadBytes(storageRef, newImageFile);
      const imageUrl = await getDownloadURL(snapshot.ref);
      
      // Atualizar produto com nova URL da imagem
      return updateDoc(productRef, { ...updates, imageUrl });
    }
    
    // Atualizar produto sem nova imagem
    return updateDoc(productRef, updates);
  }

  // Excluir produto
  async deleteProduct(productId: string, imageUrl: string): Promise<void> {
    await this.deleteProductImage(imageUrl);
    await deleteDoc(doc(this.firestore, `products/${productId}`));
  }

  // Upload da imagem do produto
  async uploadProductImage(imageFile: File, productId: string): Promise<string> {
    const storageRef = ref(this.storage, `products/${imageFile.name}`);
    const snapshot = await uploadBytes(storageRef, imageFile);
    return await getDownloadURL(snapshot.ref);
  }

  // Excluir imagem do produto
  async deleteProductImage(imageUrl: string): Promise<void> {
    const storageRef = ref(this.storage, imageUrl);
    await deleteObject(storageRef);
  }
}
