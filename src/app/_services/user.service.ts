import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/_models';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertService } from './alert.service';
import { SocketService } from './socket.service';
import { LocalStorageService } from './storage';


@Injectable({ providedIn: 'root' })
export class UserService {
    user$: Observable<User>;
    get userValue(): User {
        return this.userSubject.value;
    }

    private userSubject: BehaviorSubject<User>;
    private url = `${environment.apiUrl}/users`;

    constructor(
        private http: HttpClient,
        private router: Router,
        private storageService: LocalStorageService,
        private socketService: SocketService,
        private alertService: AlertService
    ) {
        this.userSubject = new BehaviorSubject<User>(null);
        this.user$ = this.userSubject.asObservable();

        socketService.onDisconnection(() => this.logout());
    }

    retrieveStoredUser(): User {
        return JSON.parse(this.storageService.getItem('user'));
    }

    clearStoredUser(): void {
        this.storageService.removeItem('user');
    }

    logout() {
        this.socketService.disconnect();
        this.clearStoredUser();
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    reconnect(user: User): Observable<User> {
        return this.http.post<User>(`${this.url}/reconnect`, user).pipe(
            map(this.onLogin.bind(this))
        );
    }

    login({ username, password }): Observable<User> {
        return this.http.post<User>(`${this.url}/login`, { username, password }).pipe(
            map(this.onLogin.bind(this))
        );
    }

    register({ username, email, password }): Observable<User> {
        return this.http.post<User>(`${this.url}/register`, { username, email, password }).pipe(
            map(this.onLogin.bind(this))
        );
    }

    private onLogin(user: User): User {
        console.log('Logged in: ', user);
        this.updateUser(user);
        this.socketService.connect(user.id);
        this.alertService.success(`Welcome ${user.username}`, { autoClose: true, keepAfterRouteChange: true });
        return user;
    }

    private updateUser(user: User) {
        this.storageService.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
    }
}
