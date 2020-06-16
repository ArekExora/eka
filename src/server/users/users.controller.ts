import { HttpCodes, User } from '@server/_models';
import { Request, Response } from 'express';
import { map, tap } from 'rxjs/operators';
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

        // MOCK DATA TO EASE TESTING.
        this.registerService.register({ username: 'test', password: 'Testing1', email: 'test@test.com' } as any)
            .subscribe(usr => console.log(usr));
    }

    private addConnectedUser(user: User): void {
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

    logoutById(id: string): void {
        this.removeConnectedUser(id);
    }

    login({ body }: Request, response: Response): void {
        this.loginService.login(body).pipe(
            map(u => ({ ...u, token: this.sessionService.generateToken(u) })),
            tap(u => this.addConnectedUser(u))
        ).subscribe(
            user => response.status(HttpCodes.OK).send(user),
            error => response.status(HttpCodes.Bad_Request).send(error)
        );
    }

    register({ body }: Request, response: Response): void {
        this.registerService.register(body).pipe(
            map(u => ({ ...u, token: this.sessionService.generateToken(u) })),
            tap(u => this.addConnectedUser(u))
        ).subscribe(
            user => response.status(HttpCodes.Created).send(user),
            error => response.status(HttpCodes.Bad_Request).send(error)
        );
    }
}
