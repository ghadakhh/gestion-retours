// Configuration principale de l'application Angular
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),    // Active le système de navigation
    provideHttpClient()       // Active les appels HTTP vers le backend
  ]
};
