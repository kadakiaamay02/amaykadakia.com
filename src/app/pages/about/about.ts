import { AfterViewInit, Component, DestroyRef, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PortfolioService } from '@app/services/portfolio.service';
import { Skill } from '@app/models/portfolio.model';

interface SkillGroup {
  category: string;
  skills: Skill[];
}

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('typed') typedEl!: ElementRef<HTMLSpanElement>;

  skillGroups: SkillGroup[] = [];

  private portfolioService = inject(PortfolioService);
  private destroyRef = inject(DestroyRef);
  private timeoutId?: ReturnType<typeof setTimeout>;

  private readonly lines = [
    'Hello, World!',
    'I am Amay,',
    'a Software Engineer,',
    '& a student',
  ];

  ngOnInit(): void {
    this.portfolioService.skills$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(skills => this.skillGroups = this.groupSkills(skills));
  }

  ngAfterViewInit(): void {
    this.typewriter(this.typedEl.nativeElement, this.lines);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
  }

  /** Groups skills by category, keeping the order they appear in the data */
  private groupSkills(skills: Skill[]): SkillGroup[] {
    const groups = new Map<string, Skill[]>();
    for (const skill of skills) {
      const category = skill.category ?? 'Other';
      groups.set(category, [...(groups.get(category) ?? []), skill]);
    }
    return [...groups].map(([category, skills]) => ({ category, skills }));
  }

  private typewriter(el: HTMLElement, lines: string[], speed = 70, linePause = 450): void {
    const full = lines.join('\n');

    // Show everything instantly for people who prefer reduced motion
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = full;
      return;
    }

    let i = 0;
    const tick = () => {
      el.textContent = full.slice(0, ++i);
      if (i < full.length) {
        this.timeoutId = setTimeout(tick, full[i - 1] === '\n' ? linePause : speed);
      }
    };
    tick();
  }
}