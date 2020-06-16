import { ErrorCodes, User } from '@server/_models';
import { SingletonService } from '@server/_services';
import * as bcrypt from 'bcryptjs';
import { from, Observable, throwError } from 'rxjs';
import { catchError, flatMap, map } from 'rxjs/operators';
import { UsersPersistenceService } from './users-persistence.service';

export class LoginService {

    constructor(
        private persistenceService = new UsersPersistenceService()
    ) {
        // Singleton not required!
        const instance = SingletonService.get(this);
        if (instance) {
            return instance;
        }
        console.log('*** Initializing LoginService');
    }

    private checkPassword(user: User, receivedPassword: string): Observable<User> {
        return from(bcrypt.compare(receivedPassword, user.password)).pipe(
            map(matches => {
                if (!matches) {
                    throw { code: ErrorCodes.Wrong_Password };
                }
                return user;
            })
        );
    }

    login({ username, password }): Observable<User> {
        return this.persistenceService.getByUsername(username).pipe(
            flatMap(user => this.checkPassword(user, password)),
            map(user => User.requiredFieldsOnly(user)),
            catchError(() => throwError({ code: ErrorCodes.Wrong_Password })) // Mask user not found errors
        );
    }
}
