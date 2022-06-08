import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  constructor(
    private authService: AuthService,
    private router: Router,
    public loadingController: LoadingController
  ) {}

  async onLogin(email, password) {
    try {
      this.presentLoading();
      const user = await this.authService.login(email.value, password.value);
      if (user) {
      const isVerified =  this.authService.isEmailVerified(user);
      this.redirectUser(isVerified);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async onLoginWithGoogle() {
    try {
      this.presentLoading();
      const user = await this.authService.loginWithGoogle();
      if (user) {
        const isVerified =  this.authService.isEmailVerified(user);
        this.redirectUser(isVerified);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();
  }

  private redirectUser(isVerified: boolean): void {
    if (isVerified) {
      this.router.navigate(['/movies']);
    } else {
      this.router.navigate(['verify-email']);
    }
  }
}
