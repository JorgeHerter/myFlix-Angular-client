import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms'; // For [(ngModel)] binding
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';

// NOTE: Ensure your path and file name for the service is correct
import { FetchApiDataService } from '../fetch-api-data'; 

@Component({
  selector: 'app-user-registration-form',
  // Renamed to match the file structure you listed earlier:
  templateUrl: './user-registration-form.html',
  styleUrls: ['./user-registration-form.css'],
  
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
  ]
})
export class UserRegistrationFormComponent implements OnInit {
  @Input() userData: any = { Username: '', Password: '', Email: '', Birthday: '' }; 

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void { }

  // This function is responsible for sending the form inputs to the backend
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe({
      // Added ': any' to resolve TS2307/TS7006 errors
      next: (result: any) => { 
        this.dialogRef.close(); 
        console.log(result);
        this.snackBar.open('User registration successful!', 'OK', {
          duration: 2000
        });
      },
      // Added ': any' to resolve TS7006 error
      error: (error: any) => { 
        console.error(error);
        this.snackBar.open('Registration failed. Please try again.', 'OK', {
          duration: 2000
        });
      }
    });
  }
}
