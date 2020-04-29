import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthRouteGuardService implements CanActivate {

  constructor(private authService: AuthService,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isAuthenticated) {
      this.router.navigate(['login'], { queryParams: { requested: state.url } });
    }
    return this.authService.isAuthenticated;
  }
}
