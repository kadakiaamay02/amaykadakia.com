import { Component, OnDestroy, OnInit, computed, input, signal } from '@angular/core';

/**
 * A small VS Code-style editor window that types out a few lines.
 * Used as the page header on Experience, Education and Projects,
 * and as the frame for the login form.
 *
 * <app-code-window title="Projects" fileName="projects.ts" [lines]="headerLines" />
 *
 * Anything placed between the tags (a form, for example) is shown
 * below the typed lines, inside the editor:
 *
 * <app-code-window title="Login" fileName="login.ts" [lines]="lines" [keepCaret]="false">
 *   <form>...</form>
 * </app-code-window>
 */
@Component({
  selector: 'app-code-window',
  standalone: true,
  imports: [],
  templateUrl: './code-window.html',
  styleUrl: './code-window.scss',
  host: { '[class.compact]': 'compact()' }
})
export class CodeWindow implements OnInit, OnDestroy {
  /** Page heading for screen readers (the window chrome is decorative). Leave empty when the page has its own heading. */
  title = input('');
  fileName = input.required<string>();
  lines = input<string[]>([]);
  language = input('TypeScript');
  icon = input('TS');
  speed = input(35);      // ms per character
  linePause = input(250); // ms pause at the end of each line
  /** Keep the blinking cursor after typing finishes (turn off when the window holds an input) */
  keepCaret = input(true);
  /** Smaller text and gutter, for narrow spots like a sidebar */
  compact = input(false);

  typedLines = signal<string[]>([]);
  currentLine = signal(0);
  typingDone = signal(false);
  cursorCol = computed(() => (this.typedLines()[this.currentLine()] ?? '').length + 1);

  private timeoutId?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    const lines = this.lines();
    this.typedLines.set(lines.map(() => ''));

    // Show everything instantly for people who prefer reduced motion
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.typedLines.set([...lines]);
      this.currentLine.set(Math.max(lines.length - 1, 0));
      this.typingDone.set(true);
      return;
    }

    if (!lines.length) {
      this.typingDone.set(true);
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
      } else {
        this.typingDone.set(true);
      }
    };

    this.timeoutId = setTimeout(tick, 200);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
  }

  /** True while the cursor should be shown on this line (always, or only while typing) */
  isActive(index: number): boolean {
    return index === this.currentLine() && (this.keepCaret() || !this.typingDone());
  }

  isComment(index: number): boolean {
    return this.lines()[index]?.startsWith('//') ?? false;
  }
}