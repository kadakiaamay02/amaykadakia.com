import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FlashService {
  private originalColor = '#121212';
  private timer = 800;
  private resultColors = {
    win: 'lightgreen',
    lose: 'lightcoral',
    draw: 'lightyellow',
    default: 'white'
  };

  setTimer(time: number) {
    this.timer = time;
  }

  setOriginalColor(hex: string) {
    this.originalColor = hex;
  }

  flashBackgroundColor(color: string): void {
    const app = document.querySelector('app-root') as HTMLElement;
    if (!app) {
      console.warn('app-root not found');
      return;
    }
    app.style.setProperty('background', color);
    setTimeout(() => {
      app.style.setProperty('background', this.originalColor);
    }, this.timer);
  }

  flashText(setter: (val: string) => void, text: string): void {
    setter(text);
    setTimeout(() => {
      setter('');
    }, this.timer);
  }

  flashResult(result: 'win' | 'lose' | 'draw', setter: (val: string) => void, text: string): void {
    const color = this.resultColors[result] || this.resultColors.default;
    this.flashBackgroundColor(color);
    this.flashText(setter, text);
  }
}
