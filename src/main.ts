// In src/main.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

// =====================================================================
// Zone.js polyfill - required for Angular
// Modern zone.js versions use the root export path
// =====================================================================
import 'zone.js';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));