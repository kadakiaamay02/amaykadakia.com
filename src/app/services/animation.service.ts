import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  
  constructor() {}

  initializePreloaderAnimation(): void {
    const preloader = document.querySelector('#preloader') as HTMLElement;
    const loader = document.querySelector('#loader') as HTMLElement;
    const header = document.querySelector('.s-header') as HTMLElement;
    
    if (!preloader) return;

    // Fade out loader
    if (loader) {
      loader.style.transition = 'opacity 1s ease';
      setTimeout(() => {
        loader.style.opacity = '0';
      }, 100);
    }

    // Fade out preloader
    preloader.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
    }, 1200);

    // Slide in header
    if (header) {
      header.style.transition = 'all 0.8s ease';
      header.style.transform = 'translateY(0)';
      header.style.opacity = '1';
    }

    // Animate intro elements
    const introElements = document.querySelectorAll('.s-intro .text-pretitle, .s-intro .text-huge-title');
    introElements.forEach((el, index) => {
      (el as HTMLElement).style.transition = `all 0.8s ease ${index * 0.4}ms`;
      (el as HTMLElement).style.transform = 'translateX(0)';
      (el as HTMLElement).style.opacity = '1';
    });

    // Animate circles
    const circles = document.querySelectorAll('.circles span');
    circles.forEach((el, i) => {
      const element = el as HTMLElement;
      element.style.animation = `float 2s ease-in-out ${i * 0.1}s infinite`;
    });

    this.addFloatAnimation();
  }

  private addFloatAnimation(): void {
    if (document.getElementById('float-animation')) return;
    
    const style = document.createElement('style');
    style.id = 'float-animation';
    style.innerHTML = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
    `;
    document.head.appendChild(style);
  }

  animateOnScroll(selector: string, options: any = {}): void {
    const observerOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          element.style.transition = `all ${options.duration || 800}ms ${options.easing || 'ease-out'}`;
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll(selector).forEach(el => {
      const element = el as HTMLElement;
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      observer.observe(el);
    });
  }

  resetTimeline(): void {
    // Reset animations if needed
  }
}
