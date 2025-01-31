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
  category: 'combo' | 'burger' | 'side' | 'drink';
  imageUrl: string;
  rating?: number;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  searchTerm = '';
  menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Combo X-Burguer',
      price: 29.90,
      description: 'Pão macio, hamburguer de costela 180g, queijo mussarela e molho especial. Acompanha batata frita e Refri lata.',
      category: 'combo',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500'
    },
    {
      id: '2',
      name: 'Combo Salad Burguer',
      price: 31.90,
      description: 'Pão macio, hamburguer de costela 180g, queijo mussarela, alface, tomate e molho especial. Acompanha batata frita e Refri lata.',
      category: 'combo',
      imageUrl: 'https://as2.ftcdn.net/jpg/00/92/04/47/1000_F_92044757_K6rFzZN9mBNu7w8aJFNwEAhzkV0tefUo.jpg'
    },
    {
      id: '3',
      name: 'Combo Bacon Burguer',
      price: 33.90,
      description: 'Pão macio, hamburguer de costela 180g, queijo mussarela, tiras de bacon, alface, tomate e molho especial. Acompanha batata frita e Refri lata.',
      category: 'combo',
      imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500'
    },
    {
      id: '4',
      name: 'X-Burguer',
      price: 19.90,
      description: 'Pão macio, hamburguer de costela 180g, queijo mussarela e molho especial.',
      category: 'burger',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500'
    },
    {
      id: '5',
      name: 'Salad Burguer',
      price: 21.90,
      description: 'Pão macio, hamburguer de costela 180g, queijo mussarela, alface, tomate e molho especial.',
      category: 'burger',
      imageUrl: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=500'
    },
    {
      id: '6',
      name: 'Bacon Burguer',
      price: 23.90,
      description: 'Pão macio, hamburguer de costela 180g, queijo mussarela, tiras de bacon, alface, tomate e molho especial.',
      category: 'burger',
      imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500'
    },
    {
      id: '7',
      name: 'Batata Frita',
      price: 5.90,
      description: 'Porção de batatas fritas crocantes',
      category: 'side',
      imageUrl: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500'
    },
    {
      id: '8',
      name: 'Bacon Adicional',
      price: 2.49,
      description: 'Porção adicional de bacon',
      category: 'side',
      imageUrl: 'https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500'
    },
    {
      id: '9',
      name: 'Maionese da Casa',
      price: 3.00,
      description: 'Maionese especial Gusta\'s',
      category: 'side',
      imageUrl: 'https://i.ibb.co/BVcg3Gdm/Novo-Projeto-1.png'
    },
    {
      id: '10',
      name: 'Coca-Cola Zero',
      price: 5.90,
      description: 'Lata 350ml',
      category: 'drink',
      imageUrl: 'https://i.ibb.co/xnh4H9Z/image.png'
    },
    {
      id: '11',
      name: 'Coca-Cola',
      price: 5.90,
      description: 'Lata 350ml',
      category: 'drink',
      imageUrl: 'https://confeiteiro.agilecdn.com.br/11464.png'
    },
    {
      id: '12',
      name: 'Sprite',
      price: 5.90,
      description: 'Lata 350ml',
      category: 'drink',
      imageUrl: 'https://i.ibb.co/v47Czbt6/image-2.png'
    },
    {
      id: '13',
      name: 'Kuat',
      price: 5.90,
      description: 'Lata 350ml',
      category: 'drink',
      imageUrl: 'https://i.ibb.co/xqbcNMH9/image-3.png'
    }
  ];

  filteredItems = {
    combo: this.getItemsByCategory('combo'),
    burger: this.getItemsByCategory('burger'),
    side: this.getItemsByCategory('side'),
    drink: this.getItemsByCategory('drink')
  };

  constructor(private cartService: CartService) {}

  getItemsByCategory(category: 'combo' | 'burger' | 'side' | 'drink') {
    return this.menuItems.filter(item => item.category === category);
  }

  filterItems() {
    const term = this.searchTerm.toLowerCase();
    this.filteredItems = {
      combo: this.getItemsByCategory('combo').filter(item => 
        item.name.toLowerCase().includes(term) || 
        item.description.toLowerCase().includes(term)
      ),
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