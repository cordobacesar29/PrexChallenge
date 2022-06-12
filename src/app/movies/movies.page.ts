import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, IonRouterOutlet, ActionSheetController, ModalController } from '@ionic/angular';
import { MovieFormComponent } from '../components/movie-form/movie-form.component';
import { AuthService } from '../services/auth.service';
import { MoviesApiService } from '../services/movies-api.service';
import { Movie } from '../shared/movie.interface';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
})
export class MoviesPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  newMovie: Movie = {
    titleOriginal: '',
    description: '',
    rating: 0,
    image: '',
    year: '2021',
    _id: ''
  };
  movies: Movie[] = [];
  title = 'star-angular';
  stars = [1, 2, 3, 4, 5];
  rating = 0;
  hoverState = 0;
  constructor(
    private moviesApiService: MoviesApiService,
    public routerOutlet: IonRouterOutlet,
    private actionSheetCtrl: ActionSheetController,
    public modalController: ModalController,
    private auth: AuthService
  ) { }
  // save movies from api to firebase db
  async saveMovies() {
    try {
      const response = await this.moviesApiService.getMovies();
      const movies = response;
      for(const movie of movies) {
        // eslint-disable-next-line no-underscore-dangle
        await this.moviesApiService.addDocument(movie, 'movies', movie._id);
      }
    } catch (error) {
      console.log(error);
    }
  }
  // get movies from firebase db
  getMovies() {
    this.moviesApiService.getCollection<Movie>('movies').subscribe(movies => {
      this.movies = movies;
    });
  }
  // add favorite
  addFavorite(movie: any) {
    // eslint-disable-next-line no-underscore-dangle
    this.moviesApiService.addDocument(movie, 'favorites', movie._id);
  }
  // load data
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
  // infinite scroll
  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  };

  // rating handler
  enter(i) {
    this.hoverState = i;
  }
  leave() {
    this.hoverState = 0;
  }
  updateRating(i) {
    this.rating = i;
  }
  // open modal
  async presentModal() {
    const modal = await this.modalController.create({
      component: MovieFormComponent,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }
  // edit movie
  async editMovie(movie: Movie) {
    const modal = await this.modalController.create({
      component: MovieFormComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        movie
      }
    });
    console.log(movie);
    return await modal.present();
  }

  ngOnInit() {
    this.saveMovies();
    this.getMovies();
    this.auth.presentLoading();
  }
}
