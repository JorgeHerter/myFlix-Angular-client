import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu'; // <-- Necessary for template
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

// Define structures for dialogs (stubs)
@Component({ template: `<h2>Genre Details</h2><p>{{ data.genre.Name }}: {{ data.genre.Description }}</p>`, standalone: true })
export class GenreDialogComponent { constructor(@Inject(MAT_DIALOG_DATA) public data: { genre: any }) {} }

@Component({ template: `<h2>Director Details</h2><p>{{ data.director.Name }} ({{ data.director.Birth }} - {{ data.director.Death || 'Present'}}): {{ data.director.Bio }}</p>`, standalone: true })
export class DirectorDialogComponent { constructor(@Inject(MAT_DIALOG_DATA) public data: { director: any }) {} }

@Component({ template: `<h2>Movie Details</h2><p>{{ data.movie.Description }}</p>`, standalone: true })
export class MovieDetailsDialogComponent { constructor(@Inject(MAT_DIALOG_DATA) public data: { movie: any }) {} }


@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    MatMenuModule // <--- FIXED: Now explicitly imported here.
  ],
  template: `
    <div class="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <mat-card *ngFor="let movie of movies" class="movie-card shadow-lg hover:shadow-xl transition-shadow duration-300">
        <mat-card-header class="flex flex-col items-start p-4">
          <mat-card-title class="text-xl font-bold text-indigo-800 line-clamp-1">{{ movie.Title }}</mat-card-title>
          <mat-card-subtitle class="text-gray-500">{{ movie.Director?.Name }}</mat-card-subtitle>
        </mat-card-header>
        
        <img mat-card-image [src]="movie.ImagePath || 'https://placehold.co/400x600/1e293b/ffffff?text=No+Image'" [alt]="movie.Title" class="w-full h-80 object-cover">
        
        <mat-card-content class="p-4">
          <p class="text-sm text-gray-700 line-clamp-3 mb-2">{{ movie.Description }}</p>
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
        
        <!-- Menu for secondary details -->
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="openGenreDialog(movie.Genre)">
            <mat-icon>label</mat-icon>
            <span>Genre ({{ movie.Genre?.Name }})</span>
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
      <!-- Optional: Loading or No Movies Message -->
      <div *ngIf="movies.length === 0 && !isLoading" class="col-span-full text-center py-10 text-gray-500">
        No movies found.
      </div>
      <div *ngIf="isLoading" class="col-span-full text-center py-10 text-gray-500">
        Loading movies...
      </div>
    </div>
  `,
  styles: [`
    .movie-card {
      max-width: 350px;
      margin: 0 auto;
    }
    /* Simple Menu Styling */
    .mat-menu-item {
      display: flex;
      align-items: center;
    }
    .mat-menu-item mat-icon {
      margin-right: 8px;
    }
  `]
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favoriteMovies: string[] = []; // Array of movie IDs
  username: string = ''; // Stores the logged-in username
  isLoading: boolean = true; // Loading state
  
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
        this.username = JSON.parse(user).Username;
        this.getFavoriteMovies(); // Fetches user data including favorites
    }
    this.getAllMovies();
  }

  /**
   * Fetches all movies from the API.
   */
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
  
  /**
   * Gets the current user's favorite movies list by fetching the user object.
   */
  getFavoriteMovies(): void {
    if (!this.username) return;
    
    // Using getUser, which returns the full user object including FavoriteMovies
    this.fetchApiData.getUser(this.username).subscribe({
      next: (resp: any) => {
        this.favoriteMovies = resp.FavoriteMovies || [];
        // Update localStorage with fresh user data
        localStorage.setItem('user', JSON.stringify(resp)); 
      },
      error: (error: any) => {
        console.error('Error fetching favorites:', error);
      }
    });
  }

  /**
   * Checks if a movie is in the user's favorite list.
   * @param movieId The ID of the movie to check.
   * @returns true if the movie is a favorite, false otherwise.
   */
  isFavorite(movieId: string): boolean {
    return this.favoriteMovies.includes(movieId);
  }

  /**
   * Adds or removes a movie from the user's favorites list.
   * @param movie The movie object to toggle.
   */
  toggleFavorite(movie: any): void {
    const movieId = movie._id;
    if (!this.username) {
        this.snackBar.open('Please log in to add favorites.', 'OK', { duration: 3000 });
        return;
    }

    if (this.isFavorite(movieId)) {
      // Remove logic
      this.fetchApiData.deleteFavoriteMovie(this.username, movieId).subscribe({
        next: (resp: any) => {
            this.favoriteMovies = resp.FavoriteMovies;
            this.snackBar.open(`${movie.Title} removed from favorites!`, 'OK', { duration: 2000 });
            localStorage.setItem('user', JSON.stringify(resp)); // Update localStorage
        },
        error: (error: any) => {
            console.error('Error removing favorite:', error);
            this.snackBar.open('Failed to remove from favorites.', 'OK', { duration: 3000 });
        }
      });
    } else {
      // Add logic
      this.fetchApiData.addFavoriteMovie(this.username, movieId).subscribe({
        next: (resp: any) => {
            this.favoriteMovies = resp.FavoriteMovies;
            this.snackBar.open(`${movie.Title} added to favorites!`, 'OK', { duration: 2000 });
            localStorage.setItem('user', JSON.stringify(resp)); // Update localStorage
        },
        error: (error: any) => {
            console.error('Error adding favorite:', error);
            this.snackBar.open('Failed to add to favorites.', 'OK', { duration: 3000 });
        }
      });
    }
  }

  /**
   * Opens a dialog with genre details.
   * @param genre The genre object.
   */
  openGenreDialog(genre: any): void {
    this.dialog.open(GenreDialogComponent, {
      data: { genre: genre },
      width: '400px'
    });
  }

  /**
   * Opens a dialog with director details.
   * @param director The director object.
   */
  openDirectorDialog(director: any): void {
    this.dialog.open(DirectorDialogComponent, {
      data: { director: director },
      width: '400px'
    });
  }

  /**
   * Opens a dialog with movie synopsis/details.
   * @param movie The movie object.
   */
  openMovieDetailsDialog(movie: any): void {
    this.dialog.open(MovieDetailsDialogComponent, {
      data: { movie: movie },
      width: '400px'
    });
  }
}