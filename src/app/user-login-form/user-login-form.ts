// In src/app/user-login-form/user-login-form.ts

import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog'; // Import MatDialogModule
import { FetchApiDataService } from '../fetch-api-data';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Import MatSnackBarModule
import { Router } from '@angular/router'; // Import Router
import { FormsModule } from '@angular/forms'; // Required for [(ngModel)]
import { MatInputModule } from '@angular/material/input'; // Required for input fields
import { MatButtonModule } from '@angular/material/button'; // Required for buttons
import { MatCardModule } from '@angular/material/card'; // Required for mat-card
import { MatFormFieldModule } from '@angular/material/form-field'; // Required for form fields

@Component({
  selector: 'app-user-login-form',
  // Renamed to match the file structure you listed earlier:
  templateUrl: './user-login-form.html',
  styleUrls: ['./user-login-form.css'],
  
  // *** REQUIRED FOR STANDALONE COMPONENTS ***
  standalone: true, 
  imports: [
    MatDialogModule,
    MatSnackBarModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule
    // Note: Router is injected, so we typically don't need to list it here, but its dependencies should be configured in app.config.ts
  ]
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData: any = { Username: '', Password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void { }

  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe({
      // Added ': any' to resolve implicit type errors
      next: (result: any) => { 
        // Store the user and token in localStorage
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);

        this.dialogRef.close();
        this.snackBar.open('Login successful!', 'OK', {
          duration: 2000
        });

        // Redirect the user to the movies page
        this.router.navigate(['movies']);
      },
      // Added ': any' to resolve implicit type errors
      error: (error: any) => { 
        console.error(error);
        this.snackBar.open('Login failed. Please check your username and password.', 'OK', {
          duration: 2000
        });
      }
    });
  }
}
