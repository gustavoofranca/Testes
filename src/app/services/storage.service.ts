import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private storage: Storage) {}

  async uploadProductImage(file: File, productId: string): Promise<string> {
    const storageRef = ref(this.storage, `products/${productId}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  }

  async deleteProductImage(imageUrl: string): Promise<void> {
    const imageRef = ref(this.storage, imageUrl);
    await deleteObject(imageRef);
  }
}
