import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, IonRouterOutlet, ActionSheetController, ModalController } from '@ionic/angular';
import { MovieFormComponent } from '../components/movie-form/movie-form.component';
import { AuthService } from '../services/auth.service';
import { MoviesApiService } from '../services/movies-api.service';
import { Movie } from '../shared/movie.interface';
import Swal from 'sweetalert2';
import { EditFormComponent } from '../components/edit-form/edit-form.component';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
})
export class MoviesPage implements OnInit {
  @Input() movieTitle: string;
  @Input() movieDescription: string;
  @Input() movieUrl: string;
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
    Swal.fire({
      title: 'Added to favorites',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      heightAuto: false,
    });
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
      component: EditFormComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        movie
      }
    });
    return await modal.present();
  }

  ngOnInit() {
    this.auth.presentLoading();
    this.getMovies();
  }
}
