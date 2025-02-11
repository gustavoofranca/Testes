import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Product } from '../services/product.service';

interface MenuItem extends Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  available: boolean;
  rating?: number;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Combo X-Burguer',
      description: 'Pão macio, hamburguer de costela 180g, queijo mussarela e molho especial. Acompanha batata frita e Refri lata.',
      price: 29.90,
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
      category: 'combo',
      available: true
    },
    {
      id: '2',
      name: 'Combo Salad Burguer',
      description: 'Pão macio, hamburguer de costela 180g, queijo mussarela, alface, tomate e molho especial. Acompanha batata frita e Refri lata.',
      price: 31.90,
      imageUrl: 'https://as2.ftcdn.net/jpg/00/92/04/47/1000_F_92044757_K6rFzZN9mBNu7w8aJFNwEAhzkV0tefUo.jpg',
      category: 'combo',
      available: true
    },
    {
      id: '3',
      name: 'Combo Bacon Burguer',
      description: 'Pão macio, hamburguer de costela 180g, queijo mussarela, tiras de bacon, alface, tomate e molho especial. Acompanha batata frita e Refri lata.',
      price: 33.90,
      imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500',
      category: 'combo',
      available: true
    },
    {
      id: '4',
      name: 'X-Burguer',
      description: 'Pão macio, hamburguer de costela 180g, queijo mussarela e molho especial.',
      price: 19.90,
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
      category: 'burger',
      available: true
    },
    {
      id: '5',
      name: 'Salad Burguer',
      description: 'Pão macio, hamburguer de costela 180g, queijo mussarela, alface, tomate e molho especial.',
      price: 21.90,
      imageUrl: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=500',
      category: 'burger',
      available: true
    },
    {
      id: '6',
      name: 'Bacon Burguer',
      description: 'Pão macio, hamburguer de costela 180g, queijo mussarela, tiras de bacon, alface, tomate e molho especial.',
      price: 23.90,
      imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500',
      category: 'burger',
      available: true
    },
    {
      id: '7',
      name: 'Batata Frita',
      description: 'Porção de batatas fritas crocantes',
      price: 5.90,
      imageUrl: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500',
      category: 'side',
      available: true
    },
    {
      id: '8',
      name: 'Bacon Adicional',
      description: 'Porção adicional de bacon',
      price: 2.49,
      imageUrl: 'https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500',
      category: 'side',
      available: true
    },
    {
      id: '9',
      name: 'Maionese da Casa',
      description: 'Maionese especial Gusta\'s',
      price: 3.00,
      imageUrl: 'https://i.ibb.co/BVcg3Gdm/Novo-Projeto-1.png',
      category: 'side',
      available: true
    },
    {
      id: '10',
      name: 'Coca-Cola Zero',
      description: 'Lata 350ml',
      price: 5.90,
      imageUrl: 'https://i.ibb.co/xnh4H9Z/image.png',
      category: 'drink',
      available: true
    },
    {
      id: '11',
      name: 'Coca-Cola',
      description: 'Lata 350ml',
      price: 5.90,
      imageUrl: 'https://confeiteiro.agilecdn.com.br/11464.png',
      category: 'drink',
      available: true
    },
    {
      id: '12',
      name: 'Sprite',
      description: 'Lata 350ml',
      price: 5.90,
      imageUrl: 'https://i.ibb.co/v47Czbt6/image-2.png',
      category: 'drink',
      available: true
    },
    {
      id: '13',
      name: 'Kuat',
      description: 'Lata 350ml',
      price: 5.90,
      imageUrl: 'https://i.ibb.co/xqbcNMH9/image-3.png',
      category: 'drink',
      available: true
    }
  ];

  searchTerm: string = '';
  filteredItems: { 
    combo: MenuItem[], 
    burger: MenuItem[], 
    side: MenuItem[], 
    drink: MenuItem[] 
  } = {
    combo: [],
    burger: [],
    side: [],
    drink: []
  };

  selectedCategory: string = 'all';
  categories = [
    { id: 'all', name: 'Todos' },
    { id: 'combo', name: 'Combos' },
    { id: 'burger', name: 'Hambúrgueres' },
    { id: 'side', name: 'Acompanhamentos' },
    { id: 'drink', name: 'Bebidas' }
  ];

  constructor(private cartService: CartService) {
    this.filterItems();
  }

  ngOnInit() {
    this.filterItems();
  }

  filterItems() {
    const searchLower = this.searchTerm.toLowerCase();
    
    // Filter and group items by category
    this.filteredItems = {
      combo: this.menuItems.filter(item => 
        item.category === 'combo' && 
        (item.name.toLowerCase().includes(searchLower) || 
         item.description.toLowerCase().includes(searchLower))
      ),
      burger: this.menuItems.filter(item => 
        item.category === 'burger' && 
        (item.name.toLowerCase().includes(searchLower) || 
         item.description.toLowerCase().includes(searchLower))
      ),
      side: this.menuItems.filter(item => 
        item.category === 'side' && 
        (item.name.toLowerCase().includes(searchLower) || 
         item.description.toLowerCase().includes(searchLower))
      ),
      drink: this.menuItems.filter(item => 
        item.category === 'drink' && 
        (item.name.toLowerCase().includes(searchLower) || 
         item.description.toLowerCase().includes(searchLower))
      )
    };
  }

  rateItem(item: MenuItem, rating: number) {
    // Implement rating logic here
    console.log(`Rating ${item.name} with ${rating} stars`);
  }

  addToCart(item: MenuItem) {
    this.cartService.addToCart(item, 1);
  }
}