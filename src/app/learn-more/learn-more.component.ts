import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../components/navbar/navbar.component';

@Component({
  selector: 'app-learn-more',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <div class="learn-more-container">
      <app-navbar></app-navbar>
      
      <div class="hero-section">
        <div class="hero-content">
          <h1>A História do Gusta's Burguer</h1>
          <p class="subtitle">Uma jornada de sabor e paixão</p>
        </div>
      </div>

      <div class="content-container">
        <section class="story-section">
          <div class="section-content">
            <div class="icon-wrapper">
              <i class="fas fa-heart"></i>
            </div>
            <h2>O Início de um Sonho</h2>
            <p>
              Em 2018, Gustavo, um jovem apaixonado por gastronomia, começou a experimentar 
              receitas de hambúrgueres na pequena cozinha de sua casa. O que começou como um 
              hobby rapidamente se transformou em uma obsessão por criar o hambúrguer perfeito.
            </p>
          </div>
          <div class="image-wrapper">
            <div class="placeholder-image"></div>
          </div>
        </section>

        <section class="story-section reverse">
          <div class="section-content">
            <div class="icon-wrapper">
              <i class="fas fa-store"></i>
            </div>
            <h2>O Primeiro Restaurante</h2>
            <p>
              Após dois anos de experimentação e aperfeiçoamento de receitas, Gustavo 
              finalmente abriu as portas do primeiro Gusta's Burguer em 2020. O pequeno 
              estabelecimento rapidamente ganhou fama na cidade por seus hambúrgueres 
              artesanais e molhos especiais.
            </p>
          </div>
          <div class="image-wrapper">
            <div class="placeholder-image"></div>
          </div>
        </section>

        <section class="story-section">
          <div class="section-content">
            <div class="icon-wrapper">
              <i class="fas fa-trophy"></i>
            </div>
            <h2>Reconhecimento e Crescimento</h2>
            <p>
              Em 2022, o Gusta's Burguer foi eleito o "Melhor Hambúrguer da Cidade" 
              pelo segundo ano consecutivo. O sucesso nos levou a abrir nossa segunda 
              unidade, mantendo o mesmo padrão de qualidade e atendimento que nos 
              tornou famosos.
            </p>
          </div>
          <div class="image-wrapper">
            <div class="placeholder-image"></div>
          </div>
        </section>

        <section class="highlights-section">
          <h2>Nossos Números</h2>
          <div class="highlights-grid">
            <div class="highlight-card">
              <i class="fas fa-hamburger"></i>
              <h3>50.000+</h3>
              <p>Hambúrgueres Vendidos</p>
            </div>
            <div class="highlight-card">
              <i class="fas fa-smile"></i>
              <h3>30.000+</h3>
              <p>Clientes Satisfeitos</p>
            </div>
            <div class="highlight-card">
              <i class="fas fa-star"></i>
              <h3>4.9/5</h3>
              <p>Avaliação Média</p>
            </div>
            <div class="highlight-card">
              <i class="fas fa-award"></i>
              <h3>15+</h3>
              <p>Prêmios Recebidos</p>
            </div>
          </div>
        </section>

        <section class="testimonials-section">
          <h2>O Que Dizem Nossos Clientes</h2>
          <div class="testimonials-grid">
            <div class="testimonial-card">
              <div class="testimonial-avatar">
                <div class="placeholder-avatar"></div>
              </div>
              <p class="testimonial-text">
                "O melhor hambúrguer que já comi! O blend é sensacional e os 
                molhos são únicos. Sempre que posso, volto aqui!"
              </p>
              <p class="testimonial-author">- Maria Silva</p>
            </div>
            <div class="testimonial-card">
              <div class="testimonial-avatar">
                <div class="placeholder-avatar"></div>
              </div>
              <p class="testimonial-text">
                "Atendimento impecável e hambúrgueres deliciosos. O ambiente é 
                super aconchegante. Recomendo muito!"
              </p>
              <p class="testimonial-author">- João Santos</p>
            </div>
            <div class="testimonial-card">
              <div class="testimonial-avatar">
                <div class="placeholder-avatar"></div>
              </div>
              <p class="testimonial-text">
                "As batatas fritas são as melhores da cidade e os hambúrgueres 
                são enormes! Vale cada centavo!"
              </p>
              <p class="testimonial-author">- Ana Oliveira</p>
            </div>
          </div>
        </section>

        <section class="future-section">
          <div class="section-content">
            <div class="icon-wrapper">
              <i class="fas fa-rocket"></i>
            </div>
            <h2>O Futuro</h2>
            <p>
              Nossa missão é continuar crescendo sem perder a essência que nos 
              tornou especiais. Em breve, estaremos expandindo para novas cidades, 
              levando nossa paixão por hambúrgueres artesanais para mais pessoas.
            </p>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

    .learn-more-container {
      min-height: 100vh;
      background: #1a1a1a;
      color: #fff;
    }

    .hero-section {
      height: 60vh;
      background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
                  #2a2a2a;
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      margin-bottom: 4rem;
    }

    .hero-content h1 {
      font-size: 3.5rem;
      margin-bottom: 1rem;
      color: #e84c3d;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }

    .hero-content .subtitle {
      font-size: 1.5rem;
      color: #fff;
    }

    .content-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .story-section {
      display: flex;
      align-items: center;
      gap: 4rem;
      margin-bottom: 6rem;
    }

    .story-section.reverse {
      flex-direction: row-reverse;
    }

    .section-content {
      flex: 1;
    }

    .icon-wrapper {
      font-size: 2.5rem;
      color: #e84c3d;
      margin-bottom: 1rem;
    }

    h2 {
      color: #e84c3d;
      font-size: 2rem;
      margin-bottom: 1.5rem;
    }

    p {
      line-height: 1.8;
      color: #f5f5f5;
      font-size: 1.1rem;
    }

    .image-wrapper {
      flex: 1;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }

    .placeholder-image {
      width: 100%;
      height: 300px;
      background-color: #2a2a2a;
    }

    .highlights-section {
      text-align: center;
      margin-bottom: 6rem;
    }

    .highlights-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
      margin-top: 3rem;
    }

    .highlight-card {
      background: #2a2a2a;
      padding: 2rem;
      border-radius: 10px;
      transition: transform 0.3s ease;
    }

    .highlight-card:hover {
      transform: translateY(-10px);
    }

    .highlight-card i {
      font-size: 2.5rem;
      color: #e84c3d;
      margin-bottom: 1rem;
    }

    .highlight-card h3 {
      font-size: 2rem;
      color: #fff;
      margin-bottom: 0.5rem;
    }

    .testimonials-section {
      text-align: center;
      margin-bottom: 6rem;
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      margin-top: 3rem;
    }

    .testimonial-card {
      background: #2a2a2a;
      padding: 2rem;
      border-radius: 10px;
      text-align: center;
    }

    .testimonial-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin: 0 auto 1.5rem;
      overflow: hidden;
    }

    .placeholder-avatar {
      width: 100%;
      height: 100%;
      background-color: #3a3a3a;
      border-radius: 50%;
    }

    .testimonial-text {
      font-style: italic;
      margin-bottom: 1rem;
    }

    .testimonial-author {
      color: #e84c3d;
      font-weight: bold;
    }

    .future-section {
      text-align: center;
      margin-bottom: 4rem;
    }

    @media (max-width: 1024px) {
      .highlights-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .testimonials-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .hero-content h1 {
        font-size: 2.5rem;
      }

      .story-section {
        flex-direction: column;
        gap: 2rem;
      }

      .story-section.reverse {
        flex-direction: column;
      }

      .content-container {
        padding: 0 1rem;
      }

      .highlights-grid,
      .testimonials-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class LearnMoreComponent {}
