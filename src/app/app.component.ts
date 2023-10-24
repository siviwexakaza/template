import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'frontend';
  recommendations = [];
  selectedMovie = {
    name: '',
    desc: '',
    image: '',
    year: '',
  };
  movieTitle = '';
  isLoaded = false;
  public isLoading = false;
  access_token = 'REPLACE_WITH_TMDB_ACCESS_TOKEN';

  options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer REPLACE_WITH_TMDB_API_KEY',
    },
  };
  headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Authorization', `Bearer ${this.access_token}`);
  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  findMovieByTitle(title: string) {
    this.isLoading = true;
    this.http
      .get(`https://api.themoviedb.org/3/search/movie?query=${title}`, {
        headers: this.headers,
      })
      .subscribe((movies: any) => {
        console.log('search', movies);
        const res = movies.results[0];
        this.selectedMovie = {
          name: res.title,
          desc: res.overview,
          year: res.release_date,
          image: `https://image.tmdb.org/t/p/w500${res.poster_path}`,
        };

        this.isLoading = false;
      });
  }
  search(sug: string) {
    this.movieTitle = sug;
    this.fetchMovies();
  }

  fetchMovies() {
    this.http
      .get(`http://127.0.0.1:8000/movies/${this.movieTitle}`)
      .subscribe((data: any) => {
        this.recommendations = data.data;
        this.findMovieByTitle(data.data[0]);
      });
  }

  onMovieTitleChange(e: any) {
    this.movieTitle = e.target.value;
  }
}
