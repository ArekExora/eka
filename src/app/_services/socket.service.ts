import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class SocketService {
    // tslint:disable-next-line: variable-name
    private _socket: SocketIOClient.Socket;
    private userCount$ = new BehaviorSubject<number> (1);

    connect(userId: string): void {
        if (this._socket) {
            throw new Error('User already connected to a socket.');
        }
        this._socket = io();
        this._socket.emit('login', userId);
        this._socket.on('user_count', count => this.userCount$.next(count));
        this._socket.on('join_room', msg => console.log('join_room', msg));
        this._socket.on('leave_room', msg => console.log('leave_room', msg));
        this._socket.on('room_change', ({ message, userCount }) => console.log(message, userCount));
        this._socket.on('error', error => console.error(error));
    }

    joinRoom(roomName: string) {
        this.socket.emit('join_room', roomName);
    }

    leaveRoom(roomName: string) {
        this.socket.emit('leave_room', roomName);
    }

    disconnect(): void {
        this.socket.disconnect();
        this._socket = null;
    }

    getUserCount() {
        return this.userCount$.asObservable();
    }

    private get socket() {
        if (!this._socket) {
            throw new Error('User NOT connected to a socket.');
        }

        return this._socket;
    }

}
