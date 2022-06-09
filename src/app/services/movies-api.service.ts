import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MoviesApiService {
  movies: any[] = [];

  private options = {
    method: 'GET',
    url: environment.apiURL,
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'X-RapidAPI-Key': environment.apiKey,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'X-RapidAPI-Host': environment.apiHost
    }
  };

  constructor() { }

  async getMovies(): Promise<any> {
    try {
      const response = await axios(this.options);
      return response.data.results;
    } catch (error) {
      console.log(error);
    }
  }
}
