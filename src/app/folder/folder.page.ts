import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  public folder: string;
  public movies = [
    {
      id: '1',
      title: 'The Shawshank Redemption',
      year: '1994',
      rating: '9.2',
      runtime: '142 min',
      genre: 'Drama',
      director: 'Frank Darabont',
      actors: 'Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler',
      url: 'https://www.youtube.com/watch?v=6hB3S9bIaco',
    },
    {
      id: '2',
      title: 'The Godfather',
      year: '1972',
      rating: '9.2',
      runtime: '175 min',
      genre: 'Drama',
      director: 'Francis Ford Coppola',
      actors: 'Marlon Brando, Al Pacino, James Caan, Diane Keaton',
      url: 'https://www.youtube.com/watch?v=sY1S34973zA',
    },
  ];

  constructor(private activatedRoute: ActivatedRoute) { }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.movies.length === 50) {
        event.target.disabled = true;
      }
    }, 500);
  };

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  };

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }

}
