import { Component } from '@angular/core';
import { FlashService } from '@app/services/flash.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-tic-tac-toe',
    imports: [CommonModule],
    templateUrl: './tic-tac-toe.component.html',
    styleUrl: './tic-tac-toe.component.scss'
})

export class TicTacToeComponent {
  flashTextdata: string = '';
  board: (string | null)[] = Array(9).fill(null);
  currentPlayer: 'X' | 'O' = 'X';
  winner: string | null = null;
  gameMode: 'human' | 'machine' = 'human';
  gameStarted: boolean = false;
  

  constructor(private flashService: FlashService) {}

  makeMove(index: number): void {
    if (!this.board[index] && !this.winner) {
      this.board[index] = this.currentPlayer;
      this.winner = this.calculateWinner(this.board);
      if (this.winner) {
        if (this.winner === 'X') {
          this.flashTextdata = `Player X wins!`;
          this.flashService.flashResult('win', (val: string) => this.flashTextdata = val, this.flashTextdata);
        } else if (this.winner === 'O') {
          this.flashTextdata = `Player O wins!`;
          this.flashService.flashResult('lose', (val: string) => this.flashTextdata = val, this.flashTextdata);
        } else {
          this.flashTextdata = 'Draw!';
          this.flashService.flashResult('draw', (val: string) => this.flashTextdata = val, this.flashTextdata);
        }
      } else if (this.isBoardFull()) {
        this.flashTextdata = 'Draw!';
        this.flashService.flashResult('draw', (val: string) => this.flashTextdata = val, this.flashTextdata);
      } else {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        if (this.gameMode === 'machine' && this.currentPlayer === 'O') {
          this.machineMove();
        }
      }
    }
  }

  machineMove(): void {
    // 1. Find winning move for 'O'
    for (let i = 0; i < 9; i++) {
      if (!this.board[i]) {
        const tempBoard = [...this.board];
        tempBoard[i] = 'O';
        if (this.calculateWinner(tempBoard) === 'O') {
          this.makeMove(i);
          return;
        }
      }
    }

    // 2. Find blocking move for 'X'
    for (let i = 0; i < 9; i++) {
      if (!this.board[i]) {
        const tempBoard = [...this.board];
        tempBoard[i] = 'X';
        if (this.calculateWinner(tempBoard) === 'X') {
          this.makeMove(i);
          return;
        }
      }
    }

    // 3. Take center if available
    if (!this.board[4]) {
      this.makeMove(4);
      return;
    }

    // 4. Take a corner
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => !this.board[i]);
    if (availableCorners.length > 0) {
      this.makeMove(availableCorners[Math.floor(Math.random() * availableCorners.length)]);
      return;
    }

    // 5. Take a side
    const sides = [1, 3, 5, 7];
    const availableSides = sides.filter(i => !this.board[i]);
    if (availableSides.length > 0) {
      this.makeMove(availableSides[Math.floor(Math.random() * availableSides.length)]);
      return;
    }

    // 6. Random move (should not be reached if board is not full)
    const availableMoves = this.board
      .map((cell: string | null, index: number) => (cell === null ? index : null))
      .filter((index: number | null): index is number => index !== null);

    if (availableMoves.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableMoves.length);
      const move = availableMoves[randomIndex];
      if (move !== undefined) {
        this.makeMove(move);
      }
    }
  }

  calculateWinner(board: (string | null)[]): string | null {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a] as string;
      }
    }
    return null;
  }

  setGameMode(mode: 'human' | 'machine'): void {
    this.gameMode = mode;
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.winner = null;
    this.gameStarted = true;
  }

  resetGame(): void {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.winner = null;
    this.flashTextdata = '';
  }

  toggleMode(): void {
    this.gameMode = this.gameMode === 'human' ? 'machine' : 'human';
    this.resetGame();
  }

  isBoardFull(): boolean {
    return this.board.every(cell => cell !== null);
  }
}
