import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

// Angular Material & Forms Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

/**
 * Component for handling user registration within a dialog.
 */
@Component({
  selector: 'app-user-registration-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule, 
    MatButtonModule, 
    MatInputModule, 
    MatFormFieldModule
  ],
  template: `
    <mat-card class="p-6">
      <mat-card-header>
        <mat-card-title class="text-2xl font-semibold text-indigo-700">
          Register Account
        </mat-card-title>
      </mat-card-header>

      <mat-card-content class="mt-4">
        <!-- ERROR DISPLAY SECTION -->
        <div *ngIf="errorMessages.length > 0" 
             class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p class="font-semibold mb-1">
            Registration Failed. Please correct the following errors:
          </p>
          <ul class="list-disc ml-5 space-y-1">
            <li *ngFor="let error of errorMessages">{{ error }}</li>
          </ul>
        </div>
        
        <form (ngSubmit)="registerUser()">
          <mat-form-field class="w-full">
            <mat-label>Username (min 5 characters, alphanumeric)</mat-label>
            <input 
              matInput
              [(ngModel)]="userData.Username"
              type="text"
              name="Username"
              required
            >
          </mat-form-field>
          
          <mat-form-field class="w-full">
            <mat-label>Password (min 8 chars, incl. 1 uppercase, 1 number)</mat-label>
            <input 
              matInput
              [(ngModel)]="userData.Password"
              type="password"
              name="Password"
              required
            >
          </mat-form-field>
          
          <mat-form-field class="w-full">
            <mat-label>Email</mat-label>
            <input 
              matInput
              [(ngModel)]="userData.Email"
              type="email"
              name="Email"
              required
            >
          </mat-form-field>
          
          <mat-form-field class="w-full">
            <mat-label>Birthday</mat-label>
            <input 
              matInput
              [(ngModel)]="userData.Birthday"
              type="date"
              name="Birthday"
              required
            >
          </mat-form-field>

          <button 
            mat-raised-button 
            color="primary" 
            type="submit" 
            class="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-700 transition duration-150"
          >
            Submit Registration
          </button>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .mat-mdc-card {
      max-width: 400px;
      margin: 0 auto;
    }
  `]
})
export class UserRegistrationFormComponent implements OnInit {
  
  // Component model for form data
  userData = { 
    Username: '', 
    Password: '', 
    Email: '', 
    Birthday: '' 
  };

  // Array to hold server-side validation error messages
  errorMessages: string[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  /**
   * Sends registration details to the API and handles validation errors.
   */
  registerUser(): void {
    this.errorMessages = []; // Clear old errors before submitting

    // ✅ FIXED: use correct property names for the myFlix API
    const registrationPayload = {
      Username: this.userData.Username,
      Password: this.userData.Password,
      Email: this.userData.Email,
      Birthday: this.userData.Birthday
    };

    this.fetchApiData.userRegistration(registrationPayload).subscribe({
      next: (result) => {
        this.dialogRef.close();
        this.snackBar.open('Registration successful! Please log in.', 'OK', {
          duration: 4000
        });
      },
      error: (error: HttpErrorResponse) => {
        console.error('Registration error:', error);

        if (error.status === 422 && Array.isArray(error.error?.errors)) {
          // Validation error from backend
          this.errorMessages = error.error.errors.map(
            (err: any) => err.msg || 'Invalid field data.'
          );
        } else if (error.status === 400) {
          const message =
            error.error?.message ||
            'Username already exists or validation failed.';
          this.snackBar.open(message, 'OK', { duration: 5000 });
        } else {
          this.snackBar.open(
            'An unexpected error occurred. Please try again.',
            'OK',
            { duration: 5000 }
          );
        }
      }
    });
  }
}
