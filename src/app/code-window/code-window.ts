import { Component, OnDestroy, OnInit, computed, input, signal } from '@angular/core';

/**
 * A small VS Code-style editor window that types out a few lines.
 * Used as the page header on Experience, Education and Projects.
 *
 * <app-code-window title="Projects" fileName="projects.ts" [lines]="headerLines" />
 */
@Component({
  selector: 'app-code-window',
  standalone: true,
  imports: [],
  templateUrl: './code-window.html',
  styleUrl: './code-window.scss'
})
export class CodeWindow implements OnInit, OnDestroy {
  /** Page heading for screen readers (the window itself is decorative) */
  title = input.required<string>();
  fileName = input.required<string>();
  lines = input.required<string[]>();
  language = input('TypeScript');
  icon = input('TS');
  speed = input(35);      // ms per character
  linePause = input(250); // ms pause at the end of each line

  typedLines = signal<string[]>([]);
  currentLine = signal(0);
  cursorCol = computed(() => (this.typedLines()[this.currentLine()] ?? '').length + 1);

  private timeoutId?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    const lines = this.lines();
    this.typedLines.set(lines.map(() => ''));

    // Show everything instantly for people who prefer reduced motion
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.typedLines.set([...lines]);
      this.currentLine.set(lines.length - 1);
      return;
    }

    let line = 0;
    let char = 0;

    const tick = () => {
      char++;
      this.typedLines.update(typed => {
        const next = [...typed];
        next[line] = lines[line].slice(0, char);
        return next;
      });

      if (char < lines[line].length) {
        this.timeoutId = setTimeout(tick, this.speed());
      } else if (line < lines.length - 1) {
        this.timeoutId = setTimeout(() => {
          line++;
          char = 0;
          this.currentLine.set(line);
          tick();
        }, this.linePause());
      }
    };

    this.timeoutId = setTimeout(tick, 200);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
  }

  isComment(index: number): boolean {
    return this.lines()[index]?.startsWith('//') ?? false;
  }
}