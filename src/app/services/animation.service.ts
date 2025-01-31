import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  animateToCart(startElement: HTMLElement, endElement: HTMLElement, imageUrl: string) {
    // Create floating element
    const floatingElement = document.createElement('div');
    floatingElement.style.cssText = `
      position: fixed;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-image: url('${imageUrl}');
      background-size: cover;
      background-position: center;
      z-index: 9999;
      pointer-events: none;
    `;

    // Get start and end positions
    const startRect = startElement.getBoundingClientRect();
    const endRect = endElement.getBoundingClientRect();

    // Set initial position
    floatingElement.style.left = `${startRect.left}px`;
    floatingElement.style.top = `${startRect.top}px`;

    // Add element to body
    document.body.appendChild(floatingElement);

    // Animate
    const animation = floatingElement.animate([
      {
        left: `${startRect.left}px`,
        top: `${startRect.top}px`,
        opacity: 1,
        transform: 'scale(1)'
      },
      {
        left: `${endRect.left}px`,
        top: `${endRect.top}px`,
        opacity: 0,
        transform: 'scale(0.5)'
      }
    ], {
      duration: 800,
      easing: 'ease-in-out'
    });

    // Remove element after animation
    animation.onfinish = () => {
      document.body.removeChild(floatingElement);
    };
  }
}
