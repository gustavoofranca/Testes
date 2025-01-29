import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { HomeComponent } from './app/home/home.component';
import { DashboardComponent } from './app/dashboard/dashboard.component';
import { InventoryComponent } from './app/inventory/inventory.component';
import { MenuComponent } from './app/menu/menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideRouter([
      { path: '', component: HomeComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'menu', component: MenuComponent }
    ])
  ]
}).catch(err => console.error(err));