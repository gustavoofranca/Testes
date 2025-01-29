import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { CartComponent } from '../components/cart/cart.component';
import { CartService } from '../services/cart.service';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'burger' | 'side' | 'drink' | 'sauce';
  imageUrl: string;
  rating?: number;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, CartComponent],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  searchTerm = '';
  menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'X-Burguer',
      price: 25.50,
      description: 'Pão, hambúrguer, queijo, alface, tomate e cebola',
      category: 'burger',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500'
    },
    {
      id: '2',
      name: 'X-Bacon',
      price: 28.50,
      description: 'Pão, hambúrguer, queijo, bacon, alface, tomate e cebola',
      category: 'burger',
      imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500'
    },
    {
      id: '3',
      name: 'X-Salada',
      price: 23.50,
      description: 'Pão, hambúrguer, queijo, alface, tomate, cebola e maionese',
      category: 'burger',
      imageUrl: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=500'
    },
    {
      id: '4',
      name: 'Batata Frita',
      price: 12.00,
      description: 'Porção de batatas fritas crocantes',
      category: 'side',
      imageUrl: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500'
    },
    {
      id: '5',
      name: 'Refrigerante',
      price: 6.00,
      description: 'Coca-Cola, Guaraná ou Sprite (350ml)',
      category: 'drink',
      imageUrl: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=500'
    },
    {
      id: '6',
      name: 'Maionese da Casa',
      price: 3.00,
      description: 'Maionese especial Gusta\'s',
      category: 'sauce',
      imageUrl: 'https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?w=500'
    }
  ];

  filteredItems = {
    burger: this.getItemsByCategory('burger'),
    side: this.getItemsByCategory('side'),
    drink: this.getItemsByCategory('drink'),
    sauce: this.getItemsByCategory('sauce')
  };

  constructor(private cartService: CartService) {}

  getItemsByCategory(category: 'burger' | 'side' | 'drink' | 'sauce') {
    return this.menuItems.filter(item => item.category === category);
  }

  filterItems() {
    const term = this.searchTerm.toLowerCase();
    this.filteredItems = {
      burger: this.getItemsByCategory('burger').filter(item => 
        item.name.toLowerCase().includes(term) || 
        item.description.toLowerCase().includes(term)
      ),
      side: this.getItemsByCategory('side').filter(item => 
        item.name.toLowerCase().includes(term) || 
        item.description.toLowerCase().includes(term)
      ),
      drink: this.getItemsByCategory('drink').filter(item => 
        item.name.toLowerCase().includes(term) || 
        item.description.toLowerCase().includes(term)
      ),
      sauce: this.getItemsByCategory('sauce').filter(item => 
        item.name.toLowerCase().includes(term) || 
        item.description.toLowerCase().includes(term)
      )
    };
  }

  addToCart(item: MenuItem) {
    this.cartService.addToCart(item);
  }

  rateItem(item: MenuItem, rating: number) {
    item.rating = rating;
  }
}