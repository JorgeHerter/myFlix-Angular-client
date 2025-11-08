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
    <div class="vaudeville-bg min-h-screen flex justify-center items-start p-8">
      <!-- Ornate Frame -->
      <div class="relative w-full max-w-4xl p-8 border-8 border-yellow-600 rounded-2xl shadow-2xl vaudeville-frame">

        <!-- Top Curtain -->
        <div class="absolute -top-12 left-0 w-full h-12 rounded-t-lg bg-gradient-to-b from-purple-900 to-purple-700 border-b-4 border-yellow-600 shadow-lg"></div>

        <!-- Profile Card -->
        <mat-card class="bg-transparent shadow-none text-yellow-100">
          <mat-card-header>
            <mat-card-title class="text-4xl font-extrabold text-center flex justify-center items-center gap-3 text-yellow-300 drop-shadow-md">
              <mat-icon class="text-yellow-400 text-5xl">account_circle</mat-icon>
              User Profile
            </mat-card-title>
          </mat-card-header>

          <mat-card-content class="mt-8 space-y-6">

            <!-- VIEW MODE -->
            <div *ngIf="!isEditing">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 font-semibold text-yellow-100">
                <p><span class="text-yellow-400">Username:</span> {{ user.Username }}</p>
                <p><span class="text-yellow-400">Email:</span> {{ user.Email }}</p>
                <p><span class="text-yellow-400">Birthday:</span> {{ user.Birthday | date:'longDate' }}</p>
              </div>

              <h3 class="text-2xl font-bold mt-6 mb-3 text-yellow-400 underline decoration-yellow-600">
                Favorite Movies
              </h3>

              <div *ngIf="favoriteMovies.length > 0; else noFavorites" class="flex flex-wrap gap-3">
                <span *ngFor="let movie of favoriteMovies"
                      class="px-4 py-1 bg-purple-800/60 text-yellow-200 border border-yellow-500 rounded-full shadow-md text-sm backdrop-blur-sm">
                  {{ movie.Title }}
                </span>
              </div>

              <ng-template #noFavorites>
                <p class="text-yellow-200 italic mt-2">No favorite movies added yet.</p>
              </ng-template>

              <div class="flex justify-between mt-6">
                <button mat-raised-button class="flex items-center gap-2 bg-red-800 hover:bg-red-900 text-yellow-300"
                        (click)="deleteUser()">
                  <mat-icon>delete</mat-icon> Delete Account
                </button>
                <button mat-raised-button class="flex items-center gap-2 bg-purple-900 hover:bg-purple-950 text-yellow-300"
                        (click)="isEditing = true">
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
                <button mat-stroked-button type="button" (click)="cancelEdit()"
                        class="text-yellow-200 border-yellow-600 hover:bg-purple-900/50">
                  Cancel
                </button>
                <button mat-raised-button type="submit"
                        class="flex items-center gap-2 bg-purple-900 hover:bg-purple-950 text-yellow-300">
                  <mat-icon>save</mat-icon> Save Changes
                </button>
              </div>
            </form>

          </mat-card-content>
        </mat-card>

        <!-- Bottom Curtain -->
        <div class="absolute -bottom-12 left-0 w-full h-12 rounded-b-lg bg-gradient-to-t from-purple-900 to-purple-700 border-t-4 border-yellow-600 shadow-lg"></div>
      </div>
    </div>
  `,
  styles: [`
    /* 🎭 Background - same as welcome/movie pages */
    .vaudeville-bg {
      background-image: 
        linear-gradient(to bottom, rgba(30, 10, 45, 0.95), rgba(10, 0, 25, 0.98)),
        url('https://www.transparenttextures.com/patterns/dark-wood.png');
      background-size: cover;
      background-attachment: fixed;
      color: #fef6e4;
    }

    /* Ornate golden frame styling */
    .vaudeville-frame {
      background: linear-gradient(160deg, #2e004f 0%, #3b0066 100%);
      border-radius: 20px;
      box-shadow: 0 0 40px rgba(0, 0, 0, 0.6), inset 0 0 25px rgba(255, 215, 0, 0.3);
    }

    mat-card {
      background-color: transparent !important;
    }

    mat-label, input, p {
      color: #fef6e4 !important;
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
