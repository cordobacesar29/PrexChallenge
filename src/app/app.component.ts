import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent  implements OnInit {
  userName: string;
  userImg: string;
  public appPages = [
    { title: 'Movies', url: '/movies', icon: 'videocam' },
    { title: 'Favorites', url: '/favorites', icon: 'heart' },
  ];
  constructor(
    private authSvc: AuthService,
  ) {}
  async getUserName() {
    this.userName = await this.authSvc.userData.displayName;
    this.userImg = await this.authSvc.userData.photoURL;
  }
  ngOnInit() {
    setTimeout(() => {
      this.getUserName();
    }, 3000);
  }
}
