import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ErrorCodes } from '@app/_models';
import { catchError, mapTo } from 'rxjs/operators';
import { AlertService } from './alert.service';
import { UserService } from './user.service';
import { of } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private userService: UserService,
        private alertService: AlertService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.userService.userValue) {
            // Authorised so return true
            return true;
        }

        // Calculate navigation data.
        const returnUrl = state.url !== '/' ? state.url : '';
        const navExtras = returnUrl ? { queryParams: { returnUrl }} : undefined;

        // If there is an stored user, try to reconnect.
        const user = this.userService.retrieveStoredUser();
        if (user) {
            return this.userService.reconnect(user).pipe(
                // If reconnected, proceed with navigation.
                mapTo(true),
                // If not reconnected, clear stored user and navigate to login.
                catchError(error => {
                    if (error.error.code === ErrorCodes.Session_Expired) {
                        this.alertService.error('Session expired.', { autoClose: true, keepAfterRouteChange: true });
                    } else {
                        console.error(error.error || error.message);
                    }
                    this.userService.clearStoredUser();
                    this.router.navigate(['/account/login'], navExtras);
                    return of(false);
                })
            );
        }

        // If no stored user, navigate to login.
        this.router.navigate(['/account/login'], navExtras);
        return false;
    }
}
