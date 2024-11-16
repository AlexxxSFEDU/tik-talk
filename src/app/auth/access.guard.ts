import {inject} from "@angular/core";
import {Router} from "@angular/router";

export const canActivateAuth = () =>
{
  const loggedIn = inject(AuthService).isAuth
  if (loggedIn) return true
  return inject(Router).createUrlTree(['/login'])
}
