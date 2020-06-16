import { ErrorCodes, User } from '@server/_models';
import { SingletonService } from '@server/_services';
import * as bcrypt from 'bcryptjs';
import { forkJoin, from, Observable, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { v4 as uuidV4 } from 'uuid';
import { UsersPersistenceService } from './users-persistence.service';

const REGEXP = {
    username: /^.+$/,
    email: /^.+@.+$/,
    password: /^.+$/
};

export class RegisterService {

    constructor(
        private persistenceService = new UsersPersistenceService()
    ) {
        // Singleton not required!
        const instance = SingletonService.get(this);
        if (instance) {
            return instance;
        }
        console.log('*** Initializing RegisterService');
    }

    private generateId(user: User) {
        return uuidV4();
    }

    private hashPassword(password: string): Observable<string> {
        return from(bcrypt.hash(password, 10));
    }

    private verifyValidData(user: User): User {
        const isValid = field => REGEXP[field].test(user[field]);

        const fields = ['username', 'email', 'password'].filter(k => !isValid(k)).join(',');
        if (fields) {
            throw { code: ErrorCodes.Invalid_Field, fields };
        }

        return user;
    }

    private verifyUniqueData(user: User): Observable<User> {
        const uniquenessObservables = [
            this.persistenceService.usernameExists(user.username).pipe(map(taken => taken ? 'username' : '')),
            this.persistenceService.emailExists(user.email).pipe(map(taken => taken ? 'email' : '')),
        ];

        return forkJoin(uniquenessObservables).pipe(
            map(duplicatedArray => duplicatedArray.filter(str => !!str).join(',')),
            map(fields => {
                if (fields) {
                    throw { code: ErrorCodes.Duplicated, fields };
                }
                return user;
            })
        );
    }

    private createUser(user: User): Observable<User> {
        return this.hashPassword(user.password).pipe(
            map(hash => ({
                id: this.generateId(user),
                username: user.username,
                email: user.email,
                password: hash
            }))
        );
    }

    register(received: User): Observable<User> {
        return of(received).pipe(
            map(user => this.verifyValidData(user)),
            flatMap(user => this.verifyUniqueData(user)),
            flatMap(user => this.createUser(user)),
            flatMap(user => this.persistenceService.insertUser(user)),
            map(user => User.requiredFieldsOnly(user))
        );
    }
}
