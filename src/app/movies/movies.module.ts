import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MoviesPageRoutingModule } from './movies-routing.module';
import { StarComponent } from '../components/star/star.component';

import { MoviesPage } from './movies.page';
import { HeaderComponent } from '../components/header/header.component';
import { MovieFormComponent } from '../components/movie-form/movie-form.component';
import { EditFormComponent } from '../components/edit-form/edit-form.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MoviesPageRoutingModule
  ],
  declarations: [
    MoviesPage,
    StarComponent,
    HeaderComponent,
    MovieFormComponent,
    EditFormComponent
  ]
})
export class MoviesPageModule {}
