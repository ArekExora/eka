import { ErrorCodes, User } from '@server/_models';
import { SingletonService } from '@server/_services';
import { Observable, of, throwError } from 'rxjs';

export class SessionService {

    constructor(

    ) {
        // Singleton not required!
        const instance = SingletonService.get(this);
        if (instance) {
            return instance;
        }
        console.log('*** Initializing SessionService');
    }

    checkSession(user: User): Observable<User> {
        if (user.token === `TOKEN:${user.username}`) {
            return of(user);
        }

        return throwError({ code: ErrorCodes.Session_Expired });
    }

    generateToken(user: User): Observable<string> {
        return of(`TOKEN:${user.username}`);
    }

}
