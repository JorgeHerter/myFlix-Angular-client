import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

// Assuming these forms are already standalone and available
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form';
import { UserLoginFormComponent } from '../user-login-form/user-login-form';

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [
    MatCardModule, 
    MatButtonModule, 
    UserLoginFormComponent
  ],
  template: `
    <div class="vaudeville-bg min-h-screen flex items-center justify-center px-4">
      <div class="frame-border p-6 rounded-2xl max-w-sm w-full">
        <mat-card class="vaudeville-card shadow-2xl rounded-xl">
          <mat-card-header class="justify-center text-center py-4">
            <mat-card-title class="text-3xl font-serif text-indigo-100">
              Welcome to myFlix
            </mat-card-title>
            <mat-card-subtitle class="text-purple-200 mt-2">
              Your source for movie information.
            </mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content class="space-y-6 p-4">
            <p class="text-center text-purple-100">
              Sign up or log in to explore our collection.
            </p>
            
            <div class="flex flex-col space-y-4">
              <button 
                mat-raised-button 
                color="primary" 
                (click)="openUserRegistrationDialog()"
                class="w-full py-3 font-semibold tracking-wide"
              >
                Sign Up
              </button>
              
              <button 
                mat-stroked-button 
                color="accent" 
                (click)="openUserLoginDialog()"
                class="w-full py-3 font-semibold tracking-wide"
              >
                Log In
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    /* 🎭 Background matches the movie card page */
    .vaudeville-bg {
      background-image: 
        linear-gradient(to bottom, rgba(30, 10, 45, 0.9), rgba(5, 0, 10, 0.95)),
        url('https://www.transparenttextures.com/patterns/dark-wood.png');
      background-size: cover;
      background-attachment: fixed;
      color: #fef6e4;
    }

    /* 🎞️ Golden ornate frame */
    .frame-border {
      border: 10px double #b58900;
      background: linear-gradient(145deg, #fff7e6, #fceabb);
      box-shadow: 0 0 25px rgba(0, 0, 0, 0.6);
      border-radius: 18px;
      transform: scale(1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .frame-border:hover {
      transform: scale(1.03);
      box-shadow: 0 0 35px rgba(255, 215, 0, 0.5);
    }

    /* 🎬 Inner card styling */
    .vaudeville-card {
      border: 4px solid #d4af37;
      background: linear-gradient(160deg, #fff8f0, #ffeab0);
      padding: 10px;
      text-align: center;
    }

    mat-card-title {
      font-weight: 900;
      text-shadow: 2px 2px #6b21a8;
    }

    button {
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  `]
})
export class WelcomePageComponent implements OnInit {

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  /** Opens the user registration dialog */
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px',
    });
  }

  /** Opens the user login dialog */
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '280px',
    });
  }
}
