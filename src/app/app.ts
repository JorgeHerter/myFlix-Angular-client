import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'; // <-- REQUIRED for mat-raised-button
import { RouterOutlet } from '@angular/router'; // <-- REQUIRED for <router-outlet> in app.html

import { UserRegistrationFormComponent } from './user-registration-form/user-registration-form';
import { UserLoginFormComponent } from './user-login-form/user-login-form';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: true,
  imports: [
    // Core Modules
    RouterOutlet, // <-- ADDED: For routing
    
    // Material Modules
    MatDialogModule, // <-- ADDED: For MatDialog functionality
    MatButtonModule, // <-- ADDED: For mat-raised-button
    
    // Custom Components
    //UserRegistrationFormComponent, 
    //UserLoginFormComponent
  ]
})
export class AppComponent {
  title = 'myFlix-Angular-client';

  constructor(public dialog: MatDialog) { }

  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px'
    });
  }

  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '280px'
    });
  }
}
