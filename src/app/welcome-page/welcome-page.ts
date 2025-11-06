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
    UserRegistrationFormComponent, 
    UserLoginFormComponent
  ],
  template: `
    <div class="welcome-frame p-8 min-h-screen flex flex-col items-center justify-center">
      <div class="frame-border">
        <mat-card class="w-full max-w-md shadow-2xl rounded-lg vaudeville-card">
          <mat-card-header class="justify-center text-center py-4">
            <mat-card-title class="text-3xl font-serif text-indigo-700">
              Welcome to myFlix
            </mat-card-title>
            <mat-card-subtitle class="text-gray-600 mt-2">
              Your source for movie information.
            </mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content class="space-y-4">
            <p class="text-center text-gray-700">
              Sign up or log in to explore our collection.
            </p>
            
            <div class="flex flex-col space-y-4">
              <button 
                mat-raised-button 
                color="primary" 
                (click)="openUserRegistrationDialog()"
                class="w-full py-3"
              >
                Sign Up
              </button>
              
              <button 
                mat-stroked-button 
                color="accent" 
                (click)="openUserLoginDialog()"
                class="w-full py-3"
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
    /* Page background gradient */
    .welcome-frame {
      background: radial-gradient(circle at center, #f5f0e6 0%, #e0d4b7 100%);
    }

    /* Vaudeville frame */
    .frame-border {
      padding: 20px;
      border: 12px double #b58900; /* golden double border */
      border-radius: 20px;
      box-shadow: 0 0 30px rgba(0,0,0,0.4);
      background: linear-gradient(145deg, #fff7e6, #fceabb);
    }

    /* Card styling inside frame */
    .vaudeville-card {
      border: 4px solid #d4af37; /* ornate gold inner border */
      border-radius: 15px;
      padding: 15px;
      background: linear-gradient(160deg, #fff8f0, #ffeab0);
    }

    /* Title styling */
    mat-card-title {
      font-weight: 900;
      text-shadow: 2px 2px #c49e3a;
    }

    /* Button styling */
    button {
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  `]
})
export class WelcomePageComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void { }

  /**
   * Opens the user registration dialog.
   */
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px',
    });
  }

  /**
   * Opens the user login dialog.
   */
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '280px',
    });
  }
}
