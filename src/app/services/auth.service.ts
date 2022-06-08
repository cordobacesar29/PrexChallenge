import { Injectable, NgZone } from '@angular/core';
import { User } from '../shared/user.interface';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any;
  public user$: Observable<User>;
  constructor(
    private afAuth: AngularFireAuth, // Inject Firebase auth service
    private angularFirestore: AngularFirestore,
    public ngZone: NgZone // NgZone service to remove outside scope warning
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
      await this.afAuth.signOut();
      localStorage.removeItem('user');
    } catch (error) {
      window.alert(error.message);
    }
  }

  // Sign in with email/password
  async login(email: string, password: string): Promise<User> {
    try {
      const {user} = await this.afAuth.signInWithEmailAndPassword(email, password);
      await this.updateUserData(user);
      return user;
    } catch (error) {
      window.alert(error.message);
    }
  }

  // Sign in with Google
  async loginWithGoogle(): Promise<User> {
    try {
      const {user} = await this.afAuth.signInWithPopup(new GoogleAuthProvider());
      await this.updateUserData(user);
      return user;
    } catch (error) {
      window.alert(error.message);
    }
  }

  async register(email: string, password: string): Promise<User> {
    try {
      const {user} = await this.afAuth.createUserWithEmailAndPassword(email, password);
      await this.sendVerificationEmail();
      return user;
    } catch (error) {
      window.alert(error.message);
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      return await this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      window.alert(error.message);
    }
  }

  // Send email verfificaiton when new user sign up
  async sendVerificationEmail(): Promise<void> {
    try {
      const currentUser = await this.afAuth.currentUser;
      return currentUser.sendEmailVerification();
    } catch (error) {
      window.alert(error.message);
    }
  }

  isEmailVerified(user: User): boolean {
    return user.emailVerified === true ? true : false;
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
