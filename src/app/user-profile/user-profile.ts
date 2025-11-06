import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
    <div class="bg-gradient-to-b from-red-900 via-red-700 to-red-900 min-h-screen p-8 flex justify-center items-start">
      <!-- Theater Frame -->
      <div class="relative w-full max-w-4xl p-6 border-8 border-yellow-500 shadow-2xl bg-yellow-50 rounded-lg">
        
        <!-- Top Curtain -->
        <div class="absolute -top-12 left-0 w-full h-12 bg-red-800 rounded-t-lg border-b-4 border-yellow-500 shadow-lg"></div>

        <!-- Profile Card -->
        <mat-card class="bg-yellow-50 shadow-none">
          <mat-card-header>
            <mat-card-title class="text-4xl font-extrabold text-red-800 text-center flex justify-center items-center gap-3">
              <mat-icon class="text-yellow-500">account_circle</mat-icon>
              User Profile
            </mat-card-title>
          </mat-card-header>

          <mat-card-content class="mt-6 space-y-6">

            <!-- VIEW MODE -->
            <div *ngIf="!isEditing">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-red-900 font-semibold">
                <p><span class="underline">Username:</span> {{ user.Username }}</p>
                <p><span class="underline">Email:</span> {{ user.Email }}</p>
                <p><span class="underline">Birthday:</span> {{ user.Birthday | date:'longDate' }}</p>
              </div>

              <h3 class="text-2xl font-bold mt-6 mb-2 text-red-700 underline decoration-yellow-400">Favorite Movies</h3>
              <div *ngIf="favoriteMovies.length > 0; else noFavorites" class="flex flex-wrap gap-3">
                <span *ngFor="let movie of favoriteMovies"
                      class="px-4 py-1 bg-red-200 text-red-900 font-semibold rounded-full shadow-md border-2 border-yellow-500 text-sm">
                  {{ movie.Title }}
                </span>
              </div>
              <ng-template #noFavorites>
                <p class="text-red-900 italic mt-2">No favorite movies added yet.</p>
              </ng-template>

              <div class="flex justify-between mt-6">
                <button mat-raised-button color="warn" class="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-yellow-300" (click)="deleteUser()">
                  <mat-icon>delete</mat-icon> Delete Account
                </button>
                <button mat-raised-button color="primary" class="flex items-center gap-2 bg-red-800 hover:bg-red-900 text-yellow-300" (click)="isEditing = true">
                  <mat-icon>edit</mat-icon> Edit Profile
                </button>
              </div>
            </div>

            <!-- EDIT MODE -->
            <form *ngIf="isEditing" (ngSubmit)="editUser()" class="space-y-4">
              <mat-form-field class="w-full">
                <mat-label>Username</mat-label>
                <input matInput [(ngModel)]="userData.Username" name="Username" required>
              </mat-form-field>

              <mat-form-field class="w-full">
                <mat-label>Password (leave blank to keep existing)</mat-label>
                <input matInput [(ngModel)]="userData.Password" name="Password" type="password">
              </mat-form-field>

              <mat-form-field class="w-full">
                <mat-label>Email</mat-label>
                <input matInput [(ngModel)]="userData.Email" name="Email" type="email" required>
              </mat-form-field>

              <mat-form-field class="w-full">
                <mat-label>Birthday</mat-label>
                <input matInput [(ngModel)]="userData.Birthday" name="Birthday" type="date">
              </mat-form-field>

              <div class="flex justify-end gap-4 mt-4">
                <button mat-stroked-button type="button" (click)="cancelEdit()" class="text-red-800 border-red-800 hover:bg-red-100">Cancel</button>
                <button mat-raised-button color="accent" type="submit" class="flex items-center gap-2 bg-red-800 hover:bg-red-900 text-yellow-300">
                  <mat-icon>save</mat-icon> Save Changes
                </button>
              </div>
            </form>

          </mat-card-content>
        </mat-card>

        <!-- Bottom Curtain -->
        <div class="absolute -bottom-12 left-0 w-full h-12 bg-red-800 rounded-b-lg border-t-4 border-yellow-500 shadow-lg"></div>

      </div>
    </div>
  `,
  styles: [`
    /* Optional: animate curtains */
    .bg-red-800 {
      background-image: linear-gradient(to bottom right, #7f1d1d, #b91c1c);
    }
    mat-card {
      background-color: transparent !important;
    }
  `]
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  userData: any = {};
  favoriteMovies: any[] = [];
  isEditing: boolean = false;
  username: string = '';

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  cancelEdit(): void {
    this.isEditing = false;
    const birthday = this.user.Birthday ? this.user.Birthday.split('T')[0] : '';
    this.userData = { ...this.user, Password: '', Birthday: birthday };
  }

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
        const birthday = resp.Birthday ? resp.Birthday.split('T')[0] : '';
        this.userData = { ...this.user, Password: '', Birthday: birthday };
        this.getFavoriteMovies(resp.FavoriteMovies);
        localStorage.setItem('user', JSON.stringify(resp));
      },
      error: () => this.snackBar.open('Failed to load user profile.', 'OK', { duration: 3000 })
    });
  }

  getFavoriteMovies(favoriteIds: string[]): void {
    if (favoriteIds && favoriteIds.length > 0) {
      this.fetchApiData.getAllMovies().subscribe({
        next: (allMovies: any[]) => this.favoriteMovies = allMovies.filter(m => favoriteIds.includes(m._id)),
        error: () => {
          this.snackBar.open('Could not load favorite movies.', 'OK', { duration: 3000 });
          this.favoriteMovies = [];
        }
      });
    } else {
      this.favoriteMovies = [];
    }
  }

  editUser(): void {
    const updatedData: any = {};
    for (const key in this.userData) {
      if (key !== 'Password' && this.userData[key] !== this.user[key]) updatedData[key] = this.userData[key];
      else if (key === 'Password' && this.userData[key].length > 0) updatedData[key] = this.userData[key];
    }

    if (Object.keys(updatedData).length === 0) {
      this.snackBar.open('No changes to save.', 'OK', { duration: 2000 });
      this.isEditing = false;
      return;
    }

    this.fetchApiData.editUser(this.username, updatedData).subscribe({
      next: (result: any) => {
        this.user = result;
        const birthday = result.Birthday ? result.Birthday.split('T')[0] : '';
        this.userData = { ...result, Password: '', Birthday: birthday };
        localStorage.setItem('user', JSON.stringify(result));
        this.isEditing = false;
        this.snackBar.open('Profile updated successfully!', 'OK', { duration: 2000 });
      },
      error: () => this.snackBar.open('Failed to update profile.', 'OK', { duration: 3000 })
    });
  }

  deleteUser(): void {
    this.snackBar.open('Warning: This will permanently delete your account.', 'CONFIRM', { duration: 5000 })
      .onAction().subscribe(() => {
        this.fetchApiData.deleteUser(this.username).subscribe({
          next: () => {
            this.snackBar.open('Account deleted successfully!', 'OK', { duration: 3000 });
            localStorage.clear();
            this.router.navigate(['welcome']);
          },
          error: () => this.snackBar.open('Failed to delete account.', 'OK', { duration: 3000 })
        });
      });
  }
}
