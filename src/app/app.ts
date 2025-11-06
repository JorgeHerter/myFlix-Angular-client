import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'; 
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

// Import all components and pages for use in router or component context
import { WelcomePageComponent } from './welcome-page/welcome-page';
import { MovieCardComponent } from './movie-card/movie-card';
import { UserProfileComponent } from './user-profile/user-profile';
import { UserRegistrationFormComponent } from './user-registration-form/user-registration-form';
import { UserLoginFormComponent } from './user-login-form/user-login-form';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    RouterLink,
    MatDialogModule, 
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    CommonModule,
  ],
  template: `
    <!-- Top Navigation Bar -->
    <mat-toolbar color="primary" class="shadow-md">
      <span class="text-xl font-bold">myFlix</span>
      <span class="flex-grow"></span>
      
      <!-- Navigation Links -->
      <ng-container *ngIf="isLoggedIn()">
        <button mat-button routerLink="/movies" class="flex items-center">
          <mat-icon>movie</mat-icon> <span class="hidden sm:inline ml-1">Movies</span>
        </button>
        <button mat-button routerLink="/profile" class="flex items-center">
          <mat-icon>account_circle</mat-icon> <span class="hidden sm:inline ml-1">Profile</span>
        </button>
        <button mat-button (click)="logout()" class="flex items-center">
          <mat-icon>exit_to_app</mat-icon> <span class="hidden sm:inline ml-1">Logout</span>
        </button>
      </ng-container>

      <ng-container *ngIf="!isLoggedIn()">
        <button mat-button routerLink="/welcome" class="flex items-center">
          <mat-icon>login</mat-icon> <span class="ml-1">Get Started</span>
        </button>
      </ng-container>
    </mat-toolbar>
    
    <!-- 
      RESPONSIVE CONTENT WRAPPER (The Fix)
      
      1. max-w-7xl: Limits the content width to ~1280px on large screens.
      2. mx-auto: Centers the container horizontally.
      3. p-4: Adds padding (1rem) on all screens (mobile first).
      4. md:p-8: Increases padding (2rem) on medium screens (laptops/desktops).
      5. min-h-[calc(100vh-64px)]: Ensures the content area takes up the full viewport height below the toolbar.
    -->
    <div class="max-w-7xl mx-auto p-4 md:p-8 min-h-[calc(100vh-64px)]">
        <router-outlet></router-outlet>
    </div>
  `,
  // Removed the custom .content-area CSS since Tailwind handles the padding and width now.
  styles: [``]
})
export class AppComponent implements OnInit {
  title = 'myFlix-Angular-client';

  constructor(
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Optional: Auto-redirect if token exists but user is on welcome page
    if (this.isLoggedIn() && this.router.url === '/welcome') {
      this.router.navigate(['/movies']);
    }
  }

  /**
   * Checks if the user is currently logged in by checking for a token.
   * @returns true if token is present, false otherwise.
   */
  isLoggedIn(): boolean {
    // NOTE: In a real app, localStorage should be replaced with Firestore for persistence and security.
    return !!localStorage.getItem('token');
  }

  /**
   * Clears session data and navigates to the welcome page.
   */
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/welcome']);
  }
}