import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideZoneChangeDetection } from '@angular/core'; // <-- Import needed for explicit configuration

import { routes } from './app.routes';

// Import required Angular Material modules here for global availability
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientModule } from '@angular/common/http'; // <-- IMPORTANT: Add this line

export const appConfig: ApplicationConfig = {
  providers: [
    // FIX: Explicitly configure Zone.js change detection. This resolves the NG0908 error.
    provideZoneChangeDetection({ eventCoalescing: true }), 
    
    provideRouter(routes), // Configure the router with the defined routes
    // We removed provideClientHydration() to simplify the Zone.js setup.
    provideAnimations(),
    
    // IMPORTANT: You need to import the HttpClientModule here 
    // for the FetchApiDataService to work correctly application-wide.
    importProvidersFrom([
      HttpClientModule, // <-- This is necessary for API calls
      MatDialogModule,
      MatSnackBarModule,
      MatToolbarModule,
      MatIconModule,
      MatMenuModule,
    ]),
  ]
};