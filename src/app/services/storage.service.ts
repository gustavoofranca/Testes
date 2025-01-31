import { Injectable } from '@angular/core';
<<<<<<< HEAD
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';
=======
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
>>>>>>> 9f22a7ca0676d42b7aa3b78ebeead85e78aa05cb

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private storage: Storage) {}

<<<<<<< HEAD
  async uploadImage(file: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  async deleteImage(path: string): Promise<void> {
    const storageRef = ref(this.storage, path);
    await deleteObject(storageRef);
=======
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
>>>>>>> 9f22a7ca0676d42b7aa3b78ebeead85e78aa05cb
  }
}
