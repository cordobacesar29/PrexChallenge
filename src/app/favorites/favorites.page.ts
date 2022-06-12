import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MoviesApiService } from '../services/movies-api.service';
import { Movie } from '../shared/movie.interface';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  moviesFav: Movie[];

  constructor(
    private moviesApiService: MoviesApiService,
    private auth: AuthService
  ) { }
  // get favorite movies
  getFavorites() {
    this.moviesApiService.getCollection<Movie>('favorites').subscribe(favorites => {
      this.moviesFav = favorites;
    });
  }
  // delete favorite
  deleteFavorite(movie: any) {
    // eslint-disable-next-line no-underscore-dangle
    this.moviesApiService.deleteDocument('favorites', movie._id);
  }

  ngOnInit(): void {
    this.auth.presentLoading();
    setTimeout(() => {
      this.getFavorites();
    }, 3000);
  }
}
