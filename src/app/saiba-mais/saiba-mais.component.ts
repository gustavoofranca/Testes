import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-saiba-mais',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterModule],
  templateUrl: './saiba-mais.component.html',
  styleUrls: ['./saiba-mais.component.scss']
})
export class SaibaMaisComponent {

}
