import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MoviesApiService } from 'src/app/services/movies-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss'],
})
export class EditFormComponent implements OnInit {
  movie: any;
  constructor(
    public modalController: ModalController,
    public moviesApiService: MoviesApiService,
  ) { }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true
    });
  }
  editMovie(title, desc, url, id) {
    const movie = {
      titleOriginal: title.value,
      description: desc.value,
      image: url.value,
      _id: id
    };
    // eslint-disable-next-line no-underscore-dangle
    this.moviesApiService.addDocument(movie, 'movies', movie._id);
    Swal.fire({
      title: 'Edited movie',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      heightAuto: false,
    });
    setTimeout(() => {
      this.dismiss();
    }, 1500);
  }

  ngOnInit() {
    console.log(this.movie);
  }

}
