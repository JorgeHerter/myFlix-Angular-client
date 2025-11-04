import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// This is the base URL for the API endpoints (Replace with your actual API URL)
const API_URL = 'https://myflix-movie-api.herokuapp.com/';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  // Inject the HttpClient using the inject function (Angular v14+)
  private http = inject(HttpClient);

  /**
   * Handles API errors by logging to the console and throwing an error.
   * @param error - The HTTP error response.
   * @returns An Observable that emits an error message.
   */
  private handleError(error: HttpErrorResponse): Observable<any> {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  /**
   * Retrieves the authorization token from localStorage and returns HTTP headers.
   * @returns HttpHeaders object with the Authorization header.
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    });
  }

  // --- API Endpoint Methods ---

  /**
   * User registration endpoint.
   * @param userDetails - The user registration data.
   * @returns An Observable of the API response.
   */
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(API_URL + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * User login endpoint.
   * @param userDetails - The user login credentials.
   * @returns An Observable of the API response (including token and user data).
   */
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(API_URL + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get all movies endpoint (protected).
   * @returns An Observable of all movies.
   */
  public getAllMovies(): Observable<any> {
    return this.http.get(API_URL + 'movies', { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get one movie endpoint (protected).
   * @param title - The title of the movie to retrieve.
   * @returns An Observable of the movie details.
   */
  public getMovie(title: string): Observable<any> {
    return this.http.get(API_URL + `movies/${title}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get director endpoint (protected).
   * @param directorName - The name of the director.
   * @returns An Observable of the director's details.
   */
  public getDirector(directorName: string): Observable<any> {
    return this.http.get(API_URL + `movies/directors/${directorName}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get genre endpoint (protected).
   * @param genreName - The name of the genre.
   * @returns An Observable of the genre details.
   */
  public getGenre(genreName: string): Observable<any> {
    return this.http.get(API_URL + `movies/genres/${genreName}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get user data endpoint (protected).
   * @param username - The username of the user.
   * @returns An Observable of the user's details.
   */
  public getUser(username: string): Observable<any> {
    return this.http.get(API_URL + `users/${username}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get favourite movies for a user endpoint (protected).
   * @param username - The username of the user.
   * @returns An Observable of the user's favorite movies array.
   */
  public getFavoriteMovies(username: string): Observable<any> {
    return this.http.get(API_URL + `users/${username}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Add a movie to favourite Movies endpoint (protected).
   * @param username - The username of the user.
   * @param movieId - The ID of the movie to add.
   * @returns An Observable of the updated user object.
   */
  public addFavoriteMovie(username: string, movieId: string): Observable<any> {
    return this.http.post(API_URL + `users/${username}/movies/${movieId}`, {}, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Edit user data endpoint (protected).
   * @param username - The username of the user to update.
   * @param updatedDetails - The new user details (e.g., username, password, email, birthday).
   * @returns An Observable of the updated user object.
   */
  public editUser(username: string, updatedDetails: any): Observable<any> {
    return this.http.put(API_URL + `users/${username}`, updatedDetails, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Delete user endpoint (protected).
   * @param username - The username of the user to delete.
   * @returns An Observable of the API response (success message).
   */
  public deleteUser(username: string): Observable<any> {
    return this.http.delete(API_URL + `users/${username}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Delete a movie from the favorite movies endpoint (protected).
   * @param username - The username of the user.
   * @param movieId - The ID of the movie to remove.
   * @returns An Observable of the updated user object.
   */
  public deleteFavoriteMovie(username: string, movieId: string): Observable<any> {
    return this.http.delete(API_URL + `users/${username}/movies/${movieId}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

}

