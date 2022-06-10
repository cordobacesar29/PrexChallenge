import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { MoviesApiService } from '../services/movies-api.service';
import { AuthService } from '../services/auth.service';
import { Movie } from '../shared/movie.interface';
import { NgxStarRatingComponent } from 'ngx-star-rating';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
})
export class MoviesPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  movies: Movie[] = [];
  userName: string;
  userImg: string;
  title = 'star-angular';
  stars = [1, 2, 3, 4, 5];
  rating = 0;
  hoverState = 0;
  constructor(
    private moviesApiService: MoviesApiService,
    private authSvc: AuthService
  ) { }

  async getMovies() {
    try {
      const response = await this.moviesApiService.getMovies();
      this.movies = response;
    } catch (error) {
      console.log(error);
    }
  }

  loadData(event) {
    setTimeout(() => {
      event.target.complete();
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.movies.length === 10) {
        event.target.disabled = true;
      }
    }, 500);
  };

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  };

  async getUserName() {
    this.userName = await this.authSvc.userData.displayName;
    this.userImg = await this.authSvc.userData.photoURL;
  }

  enter(i) {
    this.hoverState = i;
  }

  leave() {
    this.hoverState = 0;
  }

  updateRating(i) {
    this.rating = i;
  }

  ngOnInit() {
    this.getMovies();
    setTimeout(() => {
      this.getUserName();
    }, 3000);
  }

}
