import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import {provideStore} from "@ngrx/store";
import {provideEffects} from "@ngrx/effects";
import {AuthTokenInterceptor} from "@tt/data-access";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([AuthTokenInterceptor])),
    provideStore(),
    provideEffects()
  ],
};
