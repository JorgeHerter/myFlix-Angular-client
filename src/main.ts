// In src/main.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app'; // <-- Ensure this is 'AppComponent'

// FIX: Use AppComponent here
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
