import { Injectable, NgZone } from '@angular/core';
import { User } from '../shared/user.interface';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any;
  public user$: Observable<User>;
  constructor(
    private afAuth: AngularFireAuth, // Inject Firebase auth service
    private angularFirestore: AngularFirestore,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public alertController: AlertController,
    public loadingController: LoadingController
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.angularFirestore.doc<User>(`users/${user.uid}`).valueChanges();
        }
        return of(null);
      })
    );
     /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }
  // Sign out
  async logout(): Promise<void> {
    try {
      await this.presentLoading();
      await this.afAuth.signOut();
      localStorage.removeItem('user');
    } catch (error) {
      this.presentAlert(error.message);
    }
  }
  // Sign in with email/password
  async login(email: string, password: string): Promise<User> {
    try {
      const {user} = await this.afAuth.signInWithEmailAndPassword(email, password);
      await this.updateUserData(user);
      await this.presentLoading();
      return user;
    } catch (error) {
      this.presentAlert(error.message);
    }
  }
  // Sign in with Google
  async loginWithGoogle(): Promise<User> {
    try {
      const {user} = await this.afAuth.signInWithPopup(new GoogleAuthProvider());
      await this.updateUserData(user);
      await this.presentLoading();
      return user;
    } catch (error) {
      this.presentAlert(error.message);
    }
  }
  // Sign up with email/password
  async register(email: string, password: string): Promise<User> {
    try {
      const {user} = await this.afAuth.createUserWithEmailAndPassword(email, password);
      await this.sendVerificationEmail();
      await this.presentLoading();
      return user;
    } catch (error) {
      this.presentAlert(error.message);
    }
  }
  // Reset Forgot Password
  async resetPassword(email: string): Promise<void> {
    try {
      return await this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      this.presentAlert(error.message);
    }
  }
  // Send email verfificaiton when new user sign up
  async sendVerificationEmail(): Promise<void> {
    try {
      const currentUser = await this.afAuth.currentUser;
      return currentUser.sendEmailVerification();
    } catch (error) {
      this.presentAlert(error.message);
    }
  }
  // Verify Email
  isEmailVerified(user: User): boolean {
    return user.emailVerified === true ? true : false;
  }
  // Alert
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
  //loading component
  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();
  }

private updateUserData(user: User): Promise<void> {
    const userRef: AngularFirestoreDocument<User> = this.angularFirestore.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified
    };
    return userRef.set(data, {merge: true});
  }
}
