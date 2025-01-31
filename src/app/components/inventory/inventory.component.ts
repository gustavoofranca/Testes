import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductService, Product } from '../../services/product.service';
import { StorageService } from '../../services/storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  products$: Observable<Product[]>;
  productForm: FormGroup;
  editingProduct: Product | null = null;
  isLoading = false;

  constructor(
    private productService: ProductService,
    private storageService: StorageService,
    private fb: FormBuilder
  ) {
    this.products$ = this.productService.getProducts();
    this.productForm = this.createProductForm();
  }

  ngOnInit(): void {}

  private createProductForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      imageUrl: ['', Validators.required]
    });
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.isLoading = true;
      try {
        const productId = this.editingProduct?.id || Date.now().toString();
        const imageUrl = await this.storageService.uploadProductImage(file, productId);
        this.productForm.patchValue({ imageUrl });
      } catch (error) {
        console.error('Erro ao fazer upload da imagem:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }

  async onSubmit() {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      
      try {
        if (this.editingProduct) {
          await this.productService.updateProduct(this.editingProduct.id!, productData);
        } else {
          await this.productService.addProduct(productData);
        }
        
        this.resetForm();
      } catch (error) {
        console.error('Erro ao salvar produto:', error);
      }
    }
  }

  editProduct(product: Product) {
    this.editingProduct = product;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl
    });
  }

  async deleteProduct(productId: string) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await this.productService.deleteProduct(productId);
      } catch (error) {
        console.error('Erro ao deletar produto:', error);
      }
    }
  }

  resetForm() {
    this.editingProduct = null;
    this.productForm.reset();
  }
}
