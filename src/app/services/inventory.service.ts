import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface IngredientCategory {
  name: string;
  ingredients: Ingredient[];
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minQuantity: number;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private ingredients: IngredientCategory[] = [
    {
      name: 'Pães',
      ingredients: [
        { id: '1', name: 'Pão de Hambúrguer', quantity: 150, unit: 'unidades', minQuantity: 50, category: 'Pães' },
        { id: '2', name: 'Pão Australiano', quantity: 80, unit: 'unidades', minQuantity: 30, category: 'Pães' }
      ]
    },
    {
      name: 'Carnes',
      ingredients: [
        { id: '3', name: 'Hambúrguer 150g', quantity: 200, unit: 'unidades', minQuantity: 50, category: 'Carnes' },
        { id: '4', name: 'Bacon', quantity: 3, unit: 'kg', minQuantity: 1, category: 'Carnes' }
      ]
    },
    {
      name: 'Queijos',
      ingredients: [
        { id: '5', name: 'Queijo Cheddar', quantity: 5, unit: 'kg', minQuantity: 2, category: 'Queijos' },
        { id: '6', name: 'Queijo Prato', quantity: 4, unit: 'kg', minQuantity: 2, category: 'Queijos' }
      ]
    },
    {
      name: 'Vegetais',
      ingredients: [
        { id: '7', name: 'Alface', quantity: 20, unit: 'unidades', minQuantity: 10, category: 'Vegetais' },
        { id: '8', name: 'Tomate', quantity: 5, unit: 'kg', minQuantity: 2, category: 'Vegetais' },
        { id: '9', name: 'Cebola', quantity: 8, unit: 'kg', minQuantity: 3, category: 'Vegetais' }
      ]
    }
  ];

  private ingredientsSubject = new BehaviorSubject<IngredientCategory[]>(this.ingredients);

  getIngredients() {
    return this.ingredientsSubject.asObservable();
  }

  updateIngredientQuantity(id: string, quantity: number) {
    this.ingredients = this.ingredients.map(category => ({
      ...category,
      ingredients: category.ingredients.map(ingredient => 
        ingredient.id === id ? { ...ingredient, quantity } : ingredient
      )
    }));
    this.ingredientsSubject.next(this.ingredients);
  }
}