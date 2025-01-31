import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../components/navbar/navbar.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <div class="about-container">
      <app-navbar></app-navbar>
      
      <div class="content">
        <h1>Sobre o Gusta's Burguer</h1>
        
        <section class="about-section">
          <h2>Nossa História</h2>
          <p>
            O Gusta's Burguer nasceu da paixão por hambúrgueres artesanais e do sonho de oferecer 
            uma experiência gastronômica única em nossa cidade. Desde nossa fundação, nos dedicamos 
            a criar hambúrgueres com ingredientes frescos e de alta qualidade.
          </p>
        </section>

        <section class="about-section">
          <h2>Nossa Missão</h2>
          <p>
            Nossa missão é proporcionar momentos de felicidade através de hambúrgueres artesanais 
            preparados com dedicação e ingredientes selecionados. Buscamos sempre a excelência no 
            atendimento e na qualidade dos nossos produtos.
          </p>
        </section>

        <section class="about-section">
          <h2>Valores</h2>
          <ul>
            <li>Qualidade em primeiro lugar</li>
            <li>Atendimento excepcional</li>
            <li>Compromisso com a satisfação do cliente</li>
            <li>Inovação constante</li>
            <li>Responsabilidade social</li>
          </ul>
        </section>

        <section class="about-section">
          <h2>Contato</h2>
          <p>
            Estamos localizados no coração da cidade. Venha nos visitar ou entre em contato:
          </p>
          <ul class="contact-info">
            <li>📍 Endereço: Rua Principal, 123</li>
            <li>📱 WhatsApp: (XX) XXXXX-XXXX</li>
            <li>📷 Instagram: &#64;gustasburguer</li>
          </ul>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .about-container {
      min-height: 100vh;
      background: #1a1a1a;
      color: #fff;
    }

    .content {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      color: #e84c3d;
      font-size: 2.5rem;
      margin-bottom: 2rem;
      text-align: center;
    }

    .about-section {
      margin-bottom: 3rem;
    }

    h2 {
      color: #e84c3d;
      font-size: 1.8rem;
      margin-bottom: 1rem;
    }

    p {
      line-height: 1.6;
      margin-bottom: 1rem;
      color: #f5f5f5;
    }

    ul {
      list-style: none;
      padding-left: 0;
    }

    ul li {
      margin-bottom: 0.5rem;
      color: #f5f5f5;
    }

    .contact-info {
      background: #2a2a2a;
      padding: 1.5rem;
      border-radius: 8px;
      margin-top: 1rem;

      li {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    @media (max-width: 768px) {
      .content {
        padding: 1rem;
      }

      h1 {
        font-size: 2rem;
      }

      h2 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class AboutComponent {
}
