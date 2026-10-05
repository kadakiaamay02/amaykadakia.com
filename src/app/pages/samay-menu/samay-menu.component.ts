import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SamayLoginService } from '../../services/samay-login.service';
import { CodeWindow } from '@app/code-window/code-window';

@Component({
  selector: 'app-samay-menu',
  standalone: true,
  imports: [FormsModule, RouterLink, CodeWindow],
  templateUrl: './samay-menu.component.html',
  styleUrl: './samay-menu.component.scss'
})
export class SamayMenuComponent implements OnInit {
  showMenu = false;
  password = '';
  error = '';
  checking = false;

  readonly loginLines = [
    '// Private area',
    '// Enter the password to continue',
  ];

  constructor(private samayLoginService: SamayLoginService) {}

  ngOnInit(): void {
    this.showMenu = this.samayLoginService.isLoggedIn();
  }

  checkPassword(): void {
    if (!this.password.trim()) {
      this.error = 'Error: password is empty.';
      return;
    }

    this.checking = true;
    this.error = '';

    this.samayLoginService.validate(this.password).subscribe({
      next: valid => {
        this.checking = false;
        if (valid) {
          this.showMenu = true;
        } else {
          this.error = 'Error: incorrect password.';
          this.password = '';
        }
      },
      error: () => {
        this.checking = false;
        this.error = 'Error: could not reach the server. Try again.';
      }
    });
  }
}