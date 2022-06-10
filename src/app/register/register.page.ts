import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  async onRegister(email: any, password: any) {
    try {
      const user = await this.authService.register(email.value, password.value);
      if (user) {
        const isVerified = this.authService.isEmailVerified(user);
        this.redirectUser(isVerified);
      }
    } catch (error) {
      console.log(error);
    }
  }

  private redirectUser(isVerified: boolean): void {
    if (isVerified) {
      this.router.navigate(['/movies']);
    } else {
      this.router.navigate(['verify-email']);
    }
  }

}
