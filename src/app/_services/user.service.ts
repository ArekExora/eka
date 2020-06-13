import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/_models';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SocketService } from './socket.service';
import { LocalStorageService } from './storage';


@Injectable({ providedIn: 'root' })
export class UserService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    private url = `${environment.apiUrl}/users`;

    constructor(
        private http: HttpClient,
        private router: Router,
        private storageService: LocalStorageService,
        private socketService: SocketService
    ) {
        const savedUser = JSON.parse(this.storageService.getItem('user'));
        this.userSubject = new BehaviorSubject<User>(savedUser);
        this.user = this.userSubject.asObservable();
        if (savedUser) {
            this.socketService.connect(savedUser.id);
        }
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    private updateUser(user: User) {
        console.log('user', user);
        this.storageService.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
    }

    login({ username, password }) {
        return this.http.post(`${this.url}/login`, { username, password })
            .pipe(
                tap(this.updateUser.bind(this)),
                tap(({ id }: User) => this.socketService.connect(id))
            );
    }

    logout() {
        this.socketService.disconnect();
        this.storageService.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register({ username, email, password }) {
        return this.http.post(`${this.url}/register`, { username, email, password })
            .pipe(
                tap(this.updateUser.bind(this)),
                tap(({ id }: User) => this.socketService.connect(id))
            );
    }
}
