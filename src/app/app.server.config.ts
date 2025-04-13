import { ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { LOCALE_ID } from '@angular/core';

export const appServerConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    { provide: LOCALE_ID, useValue: 'es-ES' } 
  ]
};