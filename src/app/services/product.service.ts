import { Injectable } from '@angular/core';
<<<<<<< HEAD
import { Firestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
=======
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, collectionData } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { Observable } from 'rxjs';
>>>>>>> 9f22a7ca0676d42b7aa3b78ebeead85e78aa05cb

export interface Product {
  id?: string;
  name: string;
<<<<<<< HEAD
  price: number;
  description: string;
  category: string;
  imageUrl?: string;
=======
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  available: boolean;
>>>>>>> 9f22a7ca0676d42b7aa3b78ebeead85e78aa05cb
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
<<<<<<< HEAD
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
=======
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
>>>>>>> 9f22a7ca0676d42b7aa3b78ebeead85e78aa05cb
  }
}
