import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { AnimationService } from './services/animation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AboutComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private animationService = inject(AnimationService);

  ngOnInit(): void {
    this.animationService.initializePreloaderAnimation();
    this.animationService.animateOnScroll('[data-animate-el]');
  }
}
