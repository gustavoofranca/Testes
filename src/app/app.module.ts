import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { CommonModule } from '@angular/common';

import { environment } from '../environments/environment';
import { routes } from './app.routes';

// Components
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { MenuComponent } from './components/menu/menu.component';
import { CartComponent } from './components/cart/cart.component';
import { LoginComponent } from './components/login/login.component';
import { OrdersComponent } from './components/orders/orders.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { AboutComponent } from './components/about/about.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

// Services
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { OrderService } from './services/order.service';
import { ProductService } from './services/product.service';
import { InventoryService } from './services/inventory.service';

// Guards
import { AdminGuard } from './guards/admin.guard';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    MenuComponent,
    CartComponent,
    LoginComponent,
    OrdersComponent,
    InventoryComponent,
    AboutComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ],
  providers: [
    AuthService,
    CartService,
    OrderService,
    ProductService,
    InventoryService,
    AdminGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
