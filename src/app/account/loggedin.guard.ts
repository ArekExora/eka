import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from '@app/_services';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';


@Injectable()
export class LoggedinGuard implements CanActivate {
    constructor(
        private router: Router,
        private userService: UserService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.userService.userValue) {
            // Authorised, so return false.
            return false;
        }

        // If there is an stored user, try to reconnect.
        const user = this.userService.retrieveStoredUser();
        if (user) {
            return this.userService.reconnect(user).pipe(
                // If reconnected, navigate to home.
                map(() => {
                    this.router.navigate(['/']);
                    return false;
                }),
                // If not reconnected, clear stored user and proceed with navigation.
                catchError(error => {
                    this.userService.clearStoredUser();
                    return of(true);
                })
            );
        }

        // If no stored user, proceed with navigation.
        return true;
    }
}
