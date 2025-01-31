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
  async addProduct(product: Omit<Product, 'id'>, imageFile: File) {
    const productsRef = collection(this.firestore, 'products');
    
    // Upload da imagem
    const storageRef = ref(this.storage, `products/${imageFile.name}`);
    const snapshot = await uploadBytes(storageRef, imageFile);
    const imageUrl = await getDownloadURL(snapshot.ref);

    // Salvar produto com URL da imagem
    return addDoc(productsRef, {
      ...product,
      imageUrl,
      available: true
    });
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
  async deleteProduct(productId: string, imageUrl: string) {
    // Excluir imagem do storage
    const imageRef = ref(this.storage, imageUrl);
    await deleteObject(imageRef);
    
    // Excluir documento do produto
    const productRef = doc(this.firestore, `products/${productId}`);
    return deleteDoc(productRef);
  }
}
