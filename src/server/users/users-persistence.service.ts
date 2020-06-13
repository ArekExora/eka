import { HttpCodes, User } from '@server/_models';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

export class UsersPersistenceService {
    private userListMock: User[] = [];

    constructor(){
        console.log('*** Initializing UsersPersistenceService');
    }

    getById(id: string): Observable<User> {
        // console.log('getById', this.userListMock);
        const user = this.userListMock.find(u => u.id === id);
        return user ? of(user) : throwError(HttpCodes.Not_Found);
    }

    getByUsername(username: string): Observable<User> {
        // console.log('getByUsername', this.userListMock);
        const user = this.userListMock.find(u => u.username === username);
        return user ? of(user) : throwError(HttpCodes.Not_Found);
    }

    insertUser(user: User): Observable<User> {
        // console.log('insertUser', this.userListMock, user);
        if (!user) {
            return throwError(HttpCodes.Bad_Request);
        }

        return this.idExists(user.id).pipe(
            map(taken => {
                if (taken) {
                    throw { code: HttpCodes.Conflict };
                }
                this.userListMock.push(user);
                return user;
            })
        );
    }

    updateUser(changes: Partial<User>): Observable<User> {
        // console.log('updateUser', this.userListMock, changes);
        if (!changes || !changes.id) {
            return throwError(HttpCodes.Bad_Request);
        }

        return this.getById(changes.id).pipe(
            map(user => Object.assign(user, changes))
        );
    }

    usernameExists(username: string): Observable<boolean> {
        return of(!!this.userListMock.find(user => user.username === username));
    }

    emailExists(email: string): Observable<boolean> {
        return of(!!this.userListMock.find(user => user.email === email));
    }

    idExists(id: string): Observable<boolean> {
        return of(!!this.userListMock.find(user => user.id === id));
    }
}
