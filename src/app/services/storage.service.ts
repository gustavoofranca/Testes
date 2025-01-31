import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private storage: Storage) {}

  // Upload de imagem
  async uploadImage(file: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  }

  // Upload de imagem de produto
  async uploadProductImage(file: File, productId: string): Promise<string> {
    const path = `products/${productId}/${file.name}`;
    return this.uploadImage(file, path);
  }

  // Upload de imagem de usuário
  async uploadUserImage(file: File, userId: string): Promise<string> {
    const path = `users/${userId}/${file.name}`;
    return this.uploadImage(file, path);
  }
}
