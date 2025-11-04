import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app'; // <-- Ensure this is 'AppComponent'
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(AppComponent, config, context); // <-- FIX: Use AppComponent

export default bootstrap;