import { HttpCodes, User } from '@server/_models';
import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { forkJoin, from, Observable, of, throwError } from 'rxjs';
import { catchError, flatMap, map } from 'rxjs/operators';
import { v4 as uuidV4 } from 'uuid';
import { SingletonService } from '../_services';
import { UsersPersistenceService } from './users-persistence.service';

export class UsersController {
    private connectedUsers: User[] = []; // TODO: Hacer algo con esto

    constructor(
        private persistenceService = new UsersPersistenceService()
    ) {
        const instance = SingletonService.get(this);
        if (instance) {
            return instance;
        }
        console.log('*** Initializing UsersController');

        this.login = this.login.bind(this);
        this.register = this.register.bind(this);

        // MOCK DATA TO EASE TESTING.
        this.registerUser({ username: 'test', password: 'Testing1', email: 'test@test.com' })
            .subscribe(usr => console.log(usr));
    }

    private generateToken(): string {
        return 'TOKEN';
    }

    private hashPassword(password: string): Observable<string> {
        return from(bcrypt.hash(password, 10));
    }

    private checkPassword(user: User, receivedPassword: string): Observable<User> {
        return from(bcrypt.compare(receivedPassword, user.password)).pipe(
            map(matches => {
                if (!matches) {
                    throw HttpCodes.WrongPassword;
                }
                return user;
            })
        );
    }

    private verifyAndAssignToken({ username, password }): Observable<User> {
        return this.persistenceService.getByUsername(username).pipe(
            catchError(() => throwError(HttpCodes.WrongPassword)),
            flatMap(user => this.checkPassword(user, password)),
            flatMap(user => this.persistenceService.updateUser({ ...user, token: this.generateToken() }))
        );
    }

    private verifyValidData(protoUser: Partial<User>): Partial<User> {
        const isValid = {
            username: () => /^.+$/.test(protoUser.username),
            email: () => /^.+@.+$/.test(protoUser.email)
        };

        const fields = ['username', 'email'].filter(k => !isValid[k]()).join(',');
        if (fields) {
            throw { code: HttpCodes.Bad_Request, fields };
        }

        return protoUser;
    }

    private verifyUniqueData(protoUser: Partial<User>): Observable<Partial<User>> {
        const uniquenessObservables = [
            this.persistenceService.usernameExists(protoUser.username).pipe(map(taken => taken ? 'username' : '')),
            this.persistenceService.emailExists(protoUser.email).pipe(map(taken => taken ? 'email' : '')),
        ];

        return forkJoin(uniquenessObservables).pipe(
            map(duplicatedArray => duplicatedArray.filter(str => !!str).join(',')),
            map(fields => {
                if (fields) {
                    throw { code: HttpCodes.Conflict, fields };
                }
                return protoUser;
            })
        );
    }

    private createUser({ username, password, email }: Partial<User>): Observable<User> {
        return this.hashPassword(password).pipe(
            map(hash => ({
                username, email,
                password: hash,
                id: uuidV4(),
                token: this.generateToken()
            }))
        );
    }

    private registerUser(protoUser: Partial<User>) {
        return of(protoUser).pipe(
            map(pUser => this.verifyValidData(pUser)),
            flatMap(pUser => this.verifyUniqueData(pUser)),
            flatMap(pUser => this.createUser(pUser)),
            flatMap(user => this.persistenceService.insertUser(user))
        );
    }

    private deleteSensibleFields({ id, username, email, token }: User): Partial<User> {
        return { id, username, email, token };
    }

    login({ body }: Request, response: Response): void {
        this.verifyAndAssignToken(body).subscribe(
            user => response.status(HttpCodes.OK).send(this.deleteSensibleFields(user)),
            code => response.status(code).send(),
        );
    }

    logoutById(id: string): void {
        console.log('User with ID ' + id + ' logged out.');
        this.persistenceService.updateUser({ id, token: ''}).subscribe(
            () => {},
            code => console.error(`Error logging out user ${id}, code: ${code}`)
        );
    }

    register({ body }: Request, response: Response): void {
        this.registerUser(body).subscribe(
            user => response.status(HttpCodes.Created).send(this.deleteSensibleFields(user)),
            ({ code, fields }) => response.status(code).send(fields),
        );
    }
}
