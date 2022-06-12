import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userName: string;
  userImg: string;
  constructor(
    private authSvc: AuthService,
    private router: Router,
  ) {}
  async getUserName() {
    this.userName = await this.authSvc.userData.displayName;
    this.userImg = await this.authSvc.userData.photoURL;
  }
  async logout() {
    await this.authSvc.logout();
    this.router.navigate(['/login']);
  }
  ngOnInit(): void {
        setTimeout(() => {
      this.getUserName();
    }, 2500);
  }
}
