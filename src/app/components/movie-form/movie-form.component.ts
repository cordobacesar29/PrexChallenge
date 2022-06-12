import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MoviesApiService } from 'src/app/services/movies-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-movie-form',
  templateUrl: './movie-form.component.html',
  styleUrls: ['./movie-form.component.scss'],
})
export class MovieFormComponent implements OnInit {
  title = 'star-angular';
  stars = [1, 2, 3, 4, 5];
  rating = 0;
  hoverState = 0;
  constructor(
    private modalController: ModalController,
    private moviesApiService: MoviesApiService,
  ) { }
  // add movie to firebase db
  async addMovie(title, desc, url, rating) {
    const movie = {
      titleOriginal: title.value,
      description: desc.value,
      image: url.value,
      rating,
      _id: Date.now().toString()
    };
    // eslint-disable-next-line no-underscore-dangle
    await this.moviesApiService.addDocument(movie, 'movies', movie._id);
    Swal.fire({
      title: 'Added movie',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      heightAuto: false,
    });
    setTimeout(() => {
      this.dismiss();
    }, 1500);
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true
    });
  }
  ngOnInit() {}

}
