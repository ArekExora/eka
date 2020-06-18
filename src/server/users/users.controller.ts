import { ErrorCodes, HttpCodes, User } from '@server/_models';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { flatMap, map, tap } from 'rxjs/operators';
import { SingletonService } from '../_services';
import { LoginService, RegisterService, SessionService } from './_services';

export class UsersController {
    private connectedUsers: { [id: string]: User } = {};

    constructor(
        private loginService = new LoginService(),
        private registerService = new RegisterService(),
        private sessionService = new SessionService()
    ) {
        const instance = SingletonService.get(this);
        if (instance) {
            return instance;
        }
        console.log('*** Initializing UsersController');

        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.reconnect = this.reconnect.bind(this);

        // MOCK DATA TO EASE TESTING.
        this.registerService.register({ username: 'test', password: 'Testing1', email: 'test@test.com' } as any)
            .subscribe(usr => console.log(usr));
    }

    getUser(userId: string): User {
        return this.connectedUsers[userId] || null;
    }

    logoutById(id: string): void {
        this.removeConnectedUser(id);
    }

    reconnect({ body }: Request, response: Response): void {
        this.fromUserToResponse(this.sessionService.checkSession(body), response);
    }

    login({ body }: Request, response: Response): void {
        this.fromUserToResponse(this.loginService.login(body), response);
    }

    register({ body }: Request, response: Response): void {
        this.fromUserToResponse(this.registerService.register(body), response);
    }

    private addConnectedUser(user: User): void {
        if (this.connectedUsers[user.id]) {
            console.error(`Trying to connect user already connected: ${user.username} [${user.id}]`);
            return;
        }
        console.log(`User connected: ${user.username} [${user.id}]`);
        this.connectedUsers[user.id] = user;
    }

    private removeConnectedUser(id: string): void {
        const user = this.connectedUsers[id];
        delete this.connectedUsers[id];
        try {
            console.log(`User disconnected: ${user.username} [${user.id}]`);
        } catch (e) {
            console.error(`Trying to disconnect user not connected: ${id}`);
        }
    }

    // TODO: Use to refresh active sessions OR DELETE.
    private updateUserToken(userId: string, newToken: string): User {
        const user = this.getUser(userId);
        if (!user) {
            throw { code: ErrorCodes.Not_Found };
        }

        user.token = newToken;
        return user;
    }

    private connectUser(user: User): Observable<User> {
        return this.sessionService.generateToken(user).pipe(
            map(token => ({ ...user, token })),
            tap(u => this.addConnectedUser(u))
        );
    }

    private fromUserToResponse(user$: Observable<User>, response: Response): void {
        user$.pipe(
            flatMap(u => this.connectUser(u))
        ).subscribe(
            user => response.status(HttpCodes.OK).send(user),
            error => response.status(HttpCodes.Bad_Request).send(error)
        );
    }
}
