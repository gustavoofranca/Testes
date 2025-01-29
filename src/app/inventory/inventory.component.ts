import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InventoryService, IngredientCategory } from '../services/inventory.service';
import { NavbarComponent } from '../components/navbar/navbar.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  categories: IngredientCategory[] = [];

  constructor(private inventoryService: InventoryService) {}

  ngOnInit() {
    this.inventoryService.getIngredients().subscribe(
      categories => this.categories = categories
    );
  }

  updateQuantity(id: string, quantity: number) {
    if (quantity >= 0) {
      this.inventoryService.updateIngredientQuantity(id, quantity);
    }
  }
}