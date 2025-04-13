import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID  } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loadingInterceptor } from './core/interceptors/loading.interceptors';
import { provideNativeDateAdapter } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(), 
    provideAnimations(),
    provideNativeDateAdapter(),
    provideHttpClient(withInterceptors([loadingInterceptor])), 
    { provide: LOCALE_ID, useValue: 'es-ES' } 
    
    ]
};