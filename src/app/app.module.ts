import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { CommonModule } from '@angular/common';

import { environment } from '../environments/environment';
import { routes } from './app.routes';

// Components
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { LoginComponent } from './components/login/login.component';
import { OrdersComponent } from './components/orders/orders.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { SaibaMaisComponent } from './saiba-mais/saiba-mais.component';
import { AboutComponent } from './components/about/about.component';

// Services
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { OrderService } from './services/order.service';
import { ProductService } from './services/product.service';
import { InventoryService } from './services/inventory.service';
import { StorageService } from './services/storage.service';

// Guards
import { AdminGuard } from './guards/admin.guard';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    MenuComponent,
    LoginComponent,
    OrdersComponent,
    InventoryComponent,
    DashboardComponent,
    AdminDashboardComponent,
    SaibaMaisComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule
  ],
  providers: [
    StorageService,
    AuthService,
    CartService,
    OrderService,
    InventoryService,
    AdminGuard
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
// Removido ProductService dos providers
