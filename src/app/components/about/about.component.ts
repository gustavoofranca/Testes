import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  template: `
    <div class="about-container">
      <h1>Sobre Nós</h1>
      <p>Informações sobre a empresa...</p>
    </div>
  `,
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  constructor() {}
}
