import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SamayLoginService } from '../../services/samay-login.service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-samay-menu',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './samay-menu.component.html',
  styleUrl: './samay-menu.component.scss'
})
export class SamayMenuComponent implements OnInit {
  showMenu = false;
  password = '';
  error = '';

  constructor(private samayLoginService: SamayLoginService) {}

  ngOnInit(): void {
    this.showMenu = this.samayLoginService.isLoggedIn();
  }

  checkPassword(): void {
    this.samayLoginService.validate(this.password).subscribe(valid => {
      if (valid) {
        this.showMenu = true;
        this.error = '';
      } else {
        this.error = 'Incorrect password.';
      }
    });
  }

}
