import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../components/navbar/navbar.component';

@Component({
  selector: 'app-saiba-mais',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './saiba-mais.component.html',
  styleUrls: ['./saiba-mais.component.scss']
})
export class SaibaMaisComponent {

}
