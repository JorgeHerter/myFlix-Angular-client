import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'; 
import { RouterOutlet, RouterLink, Router } from '@angular/router'; // Import Router
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

    // NOTE: We don't need to import the pages/components here, only the
    // modules they depend on, as the Router handles loading them.
  ],
  template: `
    <mat-toolbar color="primary" class="shadow-md">
      <span class="text-xl font-bold">myFlix</span>
      <span class="flex-grow"></span>
      
      <!-- Navigation Links -->
      <ng-container *ngIf="isLoggedIn()">
        <button mat-button routerLink="/movies">
          <mat-icon>movie</mat-icon> Movies
        </button>
        <button mat-button routerLink="/profile">
          <mat-icon>account_circle</mat-icon> Profile
        </button>
        <button mat-button (click)="logout()">
          <mat-icon>exit_to_app</mat-icon> Logout
        </button>
      </ng-container>

      <ng-container *ngIf="!isLoggedIn()">
        <button mat-button routerLink="/welcome">
          <mat-icon>login</mat-icon> Get Started
        </button>
      </ng-container>
    </mat-toolbar>
    
    <div class="content-area min-h-[calc(100vh-64px)]">
        <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .content-area {
      /* Padding to give space below the toolbar and for responsive content */
      padding: 20px; 
    }
  `]
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
