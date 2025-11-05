// In src/app/user-login-form/user-login-form.ts

import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-login-form',
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
        <mat-card-title class="text-2xl font-semibold text-indigo-700">Log In</mat-card-title>
      </mat-card-header>
      <mat-card-content class="mt-4">
        <form (ngSubmit)="loginUser()">
          <mat-form-field class="w-full">
            <mat-label>Username</mat-label>
            <input 
              matInput
              [(ngModel)]="userData.Username"
              type="text"
              name="Username"
              required
            >
          </mat-form-field>
          
          <mat-form-field class="w-full">
            <mat-label>Password</mat-label>
            <input 
              matInput
              [(ngModel)]="userData.Password"
              type="password"
              name="Password"
              required
            >
          </mat-form-field>

          <button 
            mat-raised-button 
            color="primary" 
            type="submit" 
            class="w-full mt-4 py-3"
          >
            Sign In
          </button>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: []
})
export class UserLoginFormComponent implements OnInit {
  
  userData = { Username: '', Password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  /**
   * Sends the form inputs to the backend for user authentication.
   */
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe({
      next: (result) => {
        // --- CRITICAL MISSING LOGIC START ---
        
        // 1. Save the token and user object to localStorage
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        
        // 2. Close the dialog
        this.dialogRef.close(); 
        
        // 3. Show success message
        this.snackBar.open('Login successful!', 'OK', {
          duration: 2000
        });
        
        // 4. Navigate to the movies page
        this.router.navigate(['movies']);
        
        // --- CRITICAL MISSING LOGIC END ---
      },
      error: (error) => {
        console.error('Login error:', error);
        // Show detailed error message from the API if available
        const message = error.error?.error || 'Login failed. Please check your username and password.';
        this.snackBar.open(message, 'OK', {
          duration: 3000
        });
      }
    });
  }
}