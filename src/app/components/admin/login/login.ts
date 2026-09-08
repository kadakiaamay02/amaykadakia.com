import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import { environment } from '../../../../environments/environment';

declare var google: any;

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements AfterViewInit {

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.http.get<{ client_id?: string }>(`${environment.apiUrl}/config`).subscribe({
      next: (config) => {
        const clientId = config.client_id;
        if (!clientId) {
          console.error('Google client ID is missing from the backend config.');
          return;
        }

        google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => this.handleLogin(response)
        });

        google.accounts.id.renderButton(
          document.getElementById('google-btn'),
          { theme: 'outline', size: 'large', type: 'standard' }
        );
      },
      error: (err) => {
        console.error('Failed to load Google client config.', err);
      }
    });
  }

  handleLogin(response: any) {
    const googleToken = response.credential;
    
    // CRITICAL: Send this token to your backend!
    // Your backend will verify the token and check if the email matches your admin email.
    this.http.post('https://your-backend-api.com/api/admin-auth', { token: googleToken })
      .subscribe({
        next: (res) => {
          console.log('Backend confirmed you are the admin!');
          // Redirect to the admin dashboard
        },
        error: (err) => {
          console.error('Login failed or you are not the admin.', err);
          // Show an error message on the screen
        }
      });
  }
}