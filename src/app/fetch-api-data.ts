import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http'; // Explicitly import HttpErrorResponse

// Declaring the api url that will provide data for the client app
const apiUrl = 'https://myflix-movie-api.herokuapp.com/'; 

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  /**
   * Helper function to get the current user's token from localStorage
   * @returns {string} The JWT token
   */
  getToken(): string {
    const token = localStorage.getItem('token');
    return token ? token : '';
  }

  /**
   * Helper function to create standard HTTP headers with Content-Type and Authorization
   * @returns {HttpHeaders}
   */
  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
  }

  // --- API Calls ---

  // User Registration (POST /users)
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // User Login (POST /login)
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // Get All Movies (GET /movies)
  getAllMovies(): Observable<any> {
    return this.http.get(apiUrl + 'movies', { headers: this.getHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get One User (GET /users/:Username)
  getUser(username: string): Observable<any> {
    return this.http.get(apiUrl + `users/${username}`, { headers: this.getHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Add a Favorite Movie (POST /users/:Username/movies/:MovieID)
  addFavoriteMovie(username: string, movieId: string): Observable<any> {
    return this.http.post(apiUrl + `users/${username}/movies/${movieId}`, null, { headers: this.getHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Delete a Favorite Movie (DELETE /users/:Username/movies/:MovieID)
  deleteFavoriteMovie(username: string, movieId: string): Observable<any> {
    return this.http.delete(apiUrl + `users/${username}/movies/${movieId}`, { headers: this.getHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Update User Profile (PUT /users/:Username)
  editUser(username: string, updatedDetails: any): Observable<any> {
    return this.http.put(apiUrl + `users/${username}`, updatedDetails, { headers: this.getHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Delete User Account (DELETE /users/:Username)
  deleteUser(username: string): Observable<any> {
    return this.http.delete(apiUrl + `users/${username}`, { headers: this.getHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Non-typed response extraction
  private extractResponseData(res: any): any {
    // The response is already JSON, so we just return it.
    return res || {};
  }

  /**
   * Handles HTTP errors. Throws the full HttpErrorResponse if a detailed error body exists.
   * This is critical for allowing components to read server-side validation messages (like 422 errors).
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;

    // Server-side error (e.g., 400, 401, 404, 422, 500)
    if (error.status !== 0) {
      // Log the structured error to the console for debugging
      console.error(`Server-side error: ${error.status} ${error.statusText}`, error.error);
      
      // CRITICAL: Re-throw the original error object (HttpErrorResponse)
      // This allows the calling component (like UserRegistrationFormComponent) 
      // to access the detailed error body (error.error.errors)
      return throwError(() => error); 

    } else if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Status 0: Usually a connection failure (CORS or network down)
      errorMessage = 'Connection Error: Cannot reach the API server. Please check your network connection.';
    }

    console.error(errorMessage);
    // For generic connection/client errors, throw a new error object with a simple message
    return throwError(() => new Error(errorMessage));
  }
}