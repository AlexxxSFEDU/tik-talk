import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from "./services/auth.service"

export const canActivateAuth = () => {
  const loggedIn = inject(AuthService).isAuth;
  if (loggedIn) return true;
  return inject(Router).createUrlTree(['/login']);
};
