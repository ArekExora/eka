import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class SocketService {
    // tslint:disable-next-line: variable-name
    private _socket: SocketIOClient.Socket;

    connect(userId: string): void {
        if (this._socket) {
            throw new Error('User already connected to a socket.');
        }
        this._socket = io();
        this.socket.emit('login', userId);
    }

    disconnect(): void {
        this.socket.disconnect();
        this._socket = null;
    }

    private get socket() {
        if (!this._socket) {
            throw new Error('User NOT connected to a socket.');
        }

        return this._socket;
    }

}
