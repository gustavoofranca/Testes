import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { FinancialComponent } from './financial/financial.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SaibaMaisComponent } from './saiba-mais/saiba-mais.component';
import { LearnMoreComponent } from './learn-more/learn-more.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'saiba-mais', component: SaibaMaisComponent },
  { path: 'financial', component: FinancialComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'test-learn-more', component: LearnMoreComponent }
];
