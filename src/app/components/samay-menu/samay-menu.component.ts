import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SamayLoginService } from '../../services/samay-login.service';

@Component({
  selector: 'app-samay-menu',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './samay-menu.component.html',
  styleUrl: './samay-menu.component.scss'
})
export class SamayMenuComponent {
  showMenu = false;
  password = '';
  error = '';

  constructor(private samayLoginService: SamayLoginService) {}

  checkPassword(): void {
    if (this.samayLoginService.validate(this.password)) {
      this.showMenu = true;
      this.error = '';
    } else {
      this.error = 'Incorrect password.';
    }
  }

}
