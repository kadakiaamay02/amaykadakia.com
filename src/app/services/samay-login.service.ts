import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SamayLoginService {
  private validPassword = environment.samayPassword;

  validate(password: string): boolean {
    return password === this.validPassword;
  }
}
