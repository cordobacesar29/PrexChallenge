import { User } from './../shared/user.interface';
import { AuthService } from './../services/auth.service';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage {
  user$: Observable<User> = this.authSvc.user$;
  constructor(
    private authSvc: AuthService,
    public loadingController: LoadingController
  ) {}

  async onSendEmail(): Promise<void> {
    try {
      this.presentLoading();
      await this.authSvc.sendVerificationEmail();
    } catch (error) {
      console.log('Error->', error);
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

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnDestroy(): void {
    this.authSvc.logout();
  }
}
