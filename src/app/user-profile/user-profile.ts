import { Component, OnInit, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common'; 
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatCardModule, 
    MatButtonModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatIconModule,
    DatePipe
  ],
  template: `
    <div class="p-8 max-w-4xl mx-auto">
      <mat-card class="shadow-2xl rounded-lg">
        <mat-card-header class="py-4">
          <mat-card-title class="text-3xl font-bold text-indigo-700">
            <mat-icon class="mr-2 align-middle">account_circle</mat-icon>
            User Profile
          </mat-card-title>
        </mat-card-header>

        <mat-card-content class="space-y-6">
          <!-- View Mode -->
          <div *ngIf="!isEditing" class="space-y-4">
            <p><strong>Username:</strong> {{ user.Username }}</p>
            <p><strong>Email:</strong> {{ user.Email }}</p>
            <!-- The date pipe uses 'yyyy-MM-dd' for standard formats -->
            <p><strong>Birthday:</strong> {{ user.Birthday | date: 'longDate' }}</p> 
            
            <h3 class="text-xl font-semibold mt-6 mb-2 text-gray-700">Favorite Movies</h3>
            <div *ngIf="favoriteMovies.length > 0; else noFavorites" class="flex flex-wrap gap-4">
              <span *ngFor="let movie of favoriteMovies" class="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm shadow-md">
                {{ movie.Title }}
              </span>
            </div>
            <ng-template #noFavorites>
              <p class="text-gray-500 italic">No favorite movies added yet.</p>
            </ng-template>

            <div class="flex justify-between pt-4">
                <button mat-raised-button color="primary" (click)="isEditing = true">
                    <mat-icon>edit</mat-icon> Edit Profile
                </button>
                <button mat-button color="warn" (click)="deleteUser()">
                    <mat-icon>delete</mat-icon> Delete Account
                </button>
            </div>
          </div>

          <!-- Edit Mode -->
          <form *ngIf="isEditing" (ngSubmit)="editUser()" class="space-y-4">
            <mat-form-field class="w-full">
              <mat-label>Username</mat-label>
              <input matInput [(ngModel)]="userData.Username" name="Username" required>
            </mat-form-field>

            <mat-form-field class="w-full">
              <mat-label>Password (Leave blank to keep existing)</mat-label>
              <input matInput [(ngModel)]="userData.Password" name="Password" type="password">
            </mat-form-field>

            <mat-form-field class="w-full">
              <mat-label>Email</mat-label>
              <input matInput [(ngModel)]="userData.Email" name="Email" type="email" required>
            </mat-form-field>

            <mat-form-field class="w-full">
              <mat-label>Birthday</mat-label>
              <!-- Birthday date will be loaded as YYYY-MM-DD string for input type="date" -->
              <input matInput [(ngModel)]="userData.Birthday" name="Birthday" type="date">
            </mat-form-field>

            <div class="flex justify-end space-x-4">
              <!-- FIXED: Calls a single method instead of two template statements separated by ; -->
              <button mat-stroked-button (click)="cancelEdit()" type="button">
                Cancel
              </button>
              <button mat-raised-button color="accent" type="submit">
                <mat-icon>save</mat-icon> Save Changes
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: []
})
export class UserProfileComponent implements OnInit {
  user: any = {}; // Holds the current, persistent user data
  userData: any = {}; // Holds temporary form data for editing
  favoriteMovies: any[] = []; // Full movie objects for display
  isEditing: boolean = false;
  username: string = ''; // Current user's username

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getUser();
  }
  
  /**
   * FIX: Resets the form data and hides the edit view.
   */
  cancelEdit(): void {
    this.isEditing = false;
    // Reset userData to the current persistent user details
    const birthday = this.user.Birthday ? this.user.Birthday.split('T')[0] : '';
    this.userData = { ...this.user, Password: '', Birthday: birthday };
  }

  /**
   * Fetches user data from the API based on localStorage details.
   */
  getUser(): void {
    const localUser = localStorage.getItem('user');
    if (!localUser) {
      this.router.navigate(['welcome']);
      return;
    }
    
    this.username = JSON.parse(localUser).Username;

    this.fetchApiData.getUser(this.username).subscribe({
      next: (resp: any) => {
        this.user = resp;
        // API returns date string (e.g., '2000-01-01T00:00:00.000Z'). 
        // We strip the time part for the HTML input type="date"
        const birthday = resp.Birthday ? resp.Birthday.split('T')[0] : '';
        this.userData = { ...this.user, Password: '', Birthday: birthday };
        
        // Now fetch the full movie details for the user's favorites list
        this.getFavoriteMovies(resp.FavoriteMovies);

        // Update localStorage with fresh data
        localStorage.setItem('user', JSON.stringify(resp));
      },
      error: (error: any) => {
        console.error('Error fetching user data:', error);
        this.snackBar.open('Failed to load user profile.', 'OK', { duration: 3000 });
      }
    });
  }

  /**
   * Retrieves the full movie objects for the user's favorite list using the list of IDs.
   * @param favoriteIds Array of movie IDs that are favorites.
   */
  getFavoriteMovies(favoriteIds: string[]): void {
    if (favoriteIds && favoriteIds.length > 0) {
      // Fetch all movies and filter to get the full objects for favorites
      this.fetchApiData.getAllMovies().subscribe({
        next: (allMovies: any[]) => {
          this.favoriteMovies = allMovies.filter(m => favoriteIds.includes(m._id));
        },
        error: (error: any) => {
          console.error('Error fetching movie details for favorites:', error);
          this.snackBar.open('Could not load favorite movie details.', 'OK', { duration: 3000 });
          this.favoriteMovies = [];
        }
      });
    } else {
      this.favoriteMovies = [];
    }
  }

  /**
   * Updates the user's profile details.
   */
  editUser(): void {
    const updatedData: any = {};
    for (const key in this.userData) {
        // Only send fields that have changed, and exclude the empty password field
        if (key !== 'Password' && this.userData[key] !== this.user[key]) {
            updatedData[key] = this.userData[key];
        } else if (key === 'Password' && this.userData[key].length > 0) {
            updatedData[key] = this.userData[key];
        }
    }

    if (Object.keys(updatedData).length === 0) {
        this.snackBar.open('No changes to save.', 'OK', { duration: 2000 });
        this.isEditing = false;
        return;
    }

    this.fetchApiData.editUser(this.username, updatedData).subscribe({
      next: (result: any) => {
        localStorage.setItem('user', JSON.stringify(result));
        this.user = result;
        // Reset userData with new details and empty password field
        const birthday = result.Birthday ? result.Birthday.split('T')[0] : '';
        this.userData = { ...result, Password: '', Birthday: birthday }; 

        this.isEditing = false;
        this.snackBar.open('Profile updated successfully!', 'OK', { duration: 2000 });
      },
      error: (error: any) => {
        console.error(error);
        this.snackBar.open('Failed to update profile. Check console for details.', 'OK', { duration: 3000 });
      }
    });
  }

  /**
   * Deletes the user's account.
   */
  deleteUser(): void {
    // Using MatSnackBar for confirmation instead of window.confirm()
    this.snackBar.open(
        'Warning: This will permanently delete your account.', 
        'CONFIRM', 
        { duration: 5000 }
    ).onAction().subscribe(() => {
        this.fetchApiData.deleteUser(this.username).subscribe({
          next: () => {
            this.snackBar.open('Account deleted successfully!', 'OK', { duration: 3000 });
            localStorage.clear();
            this.router.navigate(['welcome']);
          },
          error: (error: any) => {
            console.error(error);
            this.snackBar.open('Failed to delete account. Check console for details.', 'OK', { duration: 3000 });
          }
        });
    });
  }
}