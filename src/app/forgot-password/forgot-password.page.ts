import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage {

  constructor(
    private authSvc: AuthService,
    private router: Router,
    public loadingController: LoadingController
  ) { }

  async onResetPassword(email) {
    try {
      this.presentLoading();
      await this.authSvc.resetPassword(email.value);
      this.router.navigateByUrl('/login');
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

}
