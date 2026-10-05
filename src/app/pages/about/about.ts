import { Component, DestroyRef, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
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
  standalone: true
})
export class About implements OnInit, OnDestroy {
  skillGroups: SkillGroup[] = [];

  private portfolioService = inject(PortfolioService);
  private destroyRef = inject(DestroyRef);
  private timeoutId?: ReturnType<typeof setTimeout>;

  private readonly lines = [
    'Hello, World!',
    'I am Amay,',
    'a Developer,',
    '& a Student.',
  ];

  /** What's currently typed on each line of the editor (starts as empty lines) */
  typedLines = signal<string[]>(this.lines.map(() => ''));

  /** The line the cursor is on */
  currentLine = signal(0);

  /** Column shown in the status bar, like VS Code's "Ln 2, Col 7" */
  cursorCol = computed(() => this.typedLines()[this.currentLine()].length + 1);

  ngOnInit(): void {
    this.portfolioService.skills$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(skills => this.skillGroups = this.groupSkills(skills));

    this.typewriter();
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

  /** Types each line character by character, pausing between lines */
  private typewriter(speed = 70, linePause = 450): void {
    // Show everything instantly for people who prefer reduced motion
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.typedLines.set([...this.lines]);
      this.currentLine.set(this.lines.length - 1);
      return;
    }

    let line = 0;
    let char = 0;

    const tick = () => {
      char++;
      this.typedLines.update(typed => {
        const next = [...typed];
        next[line] = this.lines[line].slice(0, char);
        return next;
      });

      if (char < this.lines[line].length) {
        this.timeoutId = setTimeout(tick, speed);
      } else if (line < this.lines.length - 1) {
        // Finished this line: pause, move the cursor down, keep typing
        this.timeoutId = setTimeout(() => {
          line++;
          char = 0;
          this.currentLine.set(line);
          tick();
        }, linePause);
      }
    };

    this.timeoutId = setTimeout(tick, 400); // short pause before typing starts
  }
}