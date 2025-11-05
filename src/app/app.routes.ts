import { Routes } from '@angular/router';
import { MovieCardComponent } from './movie-card/movie-card';
import { UserProfileComponent } from './user-profile/user-profile';
import { WelcomePageComponent } from './welcome-page/welcome-page';

// Simple guard function to check if user is logged in
const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

export const routes: Routes = [
  { path: 'welcome', component: WelcomePageComponent },
  
  // Guarded route for main movie view
  { 
    path: 'movies', 
    component: MovieCardComponent, 
    canActivate: [() => isAuthenticated()] 
  },
  
  // Guarded route for user profile
  { 
    path: 'profile', 
    component: UserProfileComponent, 
    canActivate: [() => isAuthenticated()] 
  },
  
  // Redirect to 'welcome' if no path is given
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  
  // Wildcard route for 404/page not found (optional, but good practice)
  { path: '**', redirectTo: 'welcome' } 
];
