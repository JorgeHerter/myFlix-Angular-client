import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FetchApiDataService } from '../fetch-api-data';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';

/** ======================
 *  DIALOG COMPONENTS
 *  ====================== */

@Component({ 
  template: `
    <h2 class="text-2xl font-bold mb-4 text-purple-800">Genre Details</h2>
    <div class="p-4">
      <p><strong>{{ data.genre?.Name || data.genre }}</strong></p>
      <p *ngIf="data.genre?.Description">{{ data.genre.Description }}</p>
    </div>
  `, 
  standalone: true,
  imports: [CommonModule]
})
export class GenreDialogComponent { 
  constructor(@Inject(MAT_DIALOG_DATA) public data: { genre: any }) {} 
}

@Component({ 
  template: `
    <h2 class="text-2xl font-bold mb-4 text-purple-800">Director Details</h2>
    <div class="p-4">
      <p><strong>{{ data.director?.Name || data.director }}</strong></p>
      <p *ngIf="data.director?.Bio">{{ data.director.Bio }}</p>
      <p *ngIf="data.director?.Birth">Born: {{ data.director.Birth }}</p>
      <p *ngIf="data.director?.Death">Died: {{ data.director.Death }}</p>
    </div>
  `, 
  standalone: true,
  imports: [CommonModule]
})
export class DirectorDialogComponent { 
  constructor(@Inject(MAT_DIALOG_DATA) public data: { director: any }) {} 
}

@Component({ 
  template: `
    <h2 class="text-2xl font-bold mb-4 text-purple-800">{{ data.movie.Title }}</h2>
    <div class="p-4">
      <p>{{ data.movie.Description }}</p>
      <p *ngIf="data.movie.ReleaseYear"><strong>Released:</strong> {{ data.movie.ReleaseYear }}</p>
    </div>
  `, 
  standalone: true,
  imports: [CommonModule]
})
export class MovieDetailsDialogComponent { 
  constructor(@Inject(MAT_DIALOG_DATA) public data: { movie: any }) {} 
}


/** ======================
 *  MAIN MOVIE CARD COMPONENT
 *  ====================== */

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <div class="vaudeville-bg min-h-screen py-12 px-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        
        <mat-card 
          *ngFor="let movie of movies" 
          class="movie-card border-4 border-yellow-900 bg-amber-50 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
        >
          <mat-card-header class="flex flex-col items-start p-4">
            <mat-card-title class="text-2xl font-extrabold text-indigo-900 line-clamp-1">
              {{ movie.Title }}
            </mat-card-title>
            <mat-card-subtitle class="text-gray-600">
              {{ movie.Director?.Name || movie.Director }}
            </mat-card-subtitle>
          </mat-card-header>

          <img 
            mat-card-image 
            [src]="movie.ImageUrl || 'https://placehold.co/400x600/1e293b/ffffff?text=No+Image'" 
            [alt]="movie.Title" 
            class="w-full h-80 object-cover rounded-md"
            (error)="handleImageError($event)"
          >

          <mat-card-content class="p-6">
            <p class="text-base text-gray-700 line-clamp-4 mb-4">
              {{ movie.Description }}
            </p>
          </mat-card-content>

          <mat-card-actions class="flex justify-between items-center p-4 pt-0">
            <button mat-button color="primary" [matMenuTriggerFor]="menu">DETAILS</button>
            <button 
              mat-icon-button 
              [color]="isFavorite(movie._id) ? 'warn' : 'basic'" 
              (click)="toggleFavorite(movie)"
              title="Toggle Favorite"
            >
              <mat-icon>{{ isFavorite(movie._id) ? 'favorite' : 'favorite_border' }}</mat-icon>
            </button>
          </mat-card-actions>

          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="openGenreDialog(movie.Genre)">
              <mat-icon>label</mat-icon>
              <span>Genre: {{ movie.Genre?.Name || movie.Genre }}</span>
            </button>
            <button mat-menu-item (click)="openDirectorDialog(movie.Director)">
              <mat-icon>person</mat-icon>
              <span>Director</span>
            </button>
            <button mat-menu-item (click)="openMovieDetailsDialog(movie)">
              <mat-icon>info</mat-icon>
              <span>Synopsis</span>
            </button>
          </mat-menu>
        </mat-card>

        <div *ngIf="movies.length === 0 && !isLoading" class="col-span-full text-center py-10 text-gray-500">
          No movies found.
        </div>
        <div *ngIf="isLoading" class="col-span-full text-center py-10 text-gray-500">
          Loading movies...
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* 🎭 Vaudeville-style theatrical background */
    .vaudeville-bg {
      background-image: 
        linear-gradient(to bottom, rgba(30, 10, 45, 0.9), rgba(5, 0, 10, 0.95)),
        url('https://www.transparenttextures.com/patterns/dark-wood.png');
      background-size: cover;
      background-attachment: fixed;
      color: #2c1810;
    }

    /* 🎞️ Ornate movie card style */
    .movie-card {
      max-width: 350px;
      margin: 0 auto;
      border-radius: 1rem;
      border: 5px double #c084fc;
      box-shadow: 0 8px 16px rgba(0,0,0,0.25);
      padding: 8px;
      background: radial-gradient(circle at top left, #fff8e1, #fce7f3);
      transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    }

    .movie-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.4);
      border-color: #facc15;
    }

    .mat-menu-item mat-icon {
      margin-right: 8px;
    }
  `]
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favoriteMovies: string[] = [];
  username: string = '';
  isLoading: boolean = true;
  
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
        this.username = JSON.parse(user).Username;
        this.getFavoriteMovies();
    }
    this.getAllMovies();
  }

  getAllMovies(): void {
    this.isLoading = true;
    this.fetchApiData.getAllMovies().subscribe({
      next: (resp: any) => {
        this.movies = resp;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching movies:', error);
        this.snackBar.open('Failed to load movies.', 'OK', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }
  
  getFavoriteMovies(): void {
    if (!this.username) return;
    this.fetchApiData.getUser(this.username).subscribe({
      next: (resp: any) => {
        this.favoriteMovies = resp.FavoriteMovies || [];
        localStorage.setItem('user', JSON.stringify(resp)); 
      },
      error: (error: any) => {
        console.error('Error fetching favorites:', error);
      }
    });
  }

  isFavorite(movieId: string): boolean {
    return this.favoriteMovies.includes(movieId);
  }

  toggleFavorite(movie: any): void {
    const movieId = movie._id;
    if (!this.username) {
        this.snackBar.open('Please log in to add favorites.', 'OK', { duration: 3000 });
        return;
    }

    if (this.isFavorite(movieId)) {
      this.fetchApiData.deleteFavoriteMovie(this.username, movieId).subscribe({
        next: (resp: any) => {
            this.favoriteMovies = resp.FavoriteMovies;
            this.snackBar.open(`${movie.Title} removed from favorites!`, 'OK', { duration: 2000 });
            localStorage.setItem('user', JSON.stringify(resp));
        },
        error: (error: any) => {
            console.error('Error removing favorite:', error);
            this.snackBar.open('Failed to remove from favorites.', 'OK', { duration: 3000 });
        }
      });
    } else {
      this.fetchApiData.addFavoriteMovie(this.username, movieId).subscribe({
        next: (resp: any) => {
            this.favoriteMovies = resp.FavoriteMovies;
            this.snackBar.open(`${movie.Title} added to favorites!`, 'OK', { duration: 2000 });
            localStorage.setItem('user', JSON.stringify(resp));
        },
        error: (error: any) => {
            console.error('Error adding favorite:', error);
            this.snackBar.open('Failed to add to favorites.', 'OK', { duration: 3000 });
        }
      });
    }
  }

  handleImageError(event: any): void {
    event.target.src = 'https://placehold.co/400x600/1e293b/ffffff?text=No+Image';
  }

  openGenreDialog(genre: any): void {
    this.dialog.open(GenreDialogComponent, {
      data: { genre: genre },
      width: '400px'
    });
  }

  openDirectorDialog(director: any): void {
    this.dialog.open(DirectorDialogComponent, {
      data: { director: director },
      width: '400px'
    });
  }

  openMovieDetailsDialog(movie: any): void {
    this.dialog.open(MovieDetailsDialogComponent, {
      data: { movie: movie },
      width: '400px'
    });
  }
}
