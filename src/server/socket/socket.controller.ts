import { UsersController } from '../users';
import { Socket } from 'socket.io';

let instance: SocketController;

export class SocketController {
    private usersController: UsersController;
    private socketByUser: { [userId: string]: Socket } = {};
    private userBySocket: { [socketId: string]: string } = {};

    constructor() {
        // Kind of singleton implementation.
        if (instance) {
            return instance;
        } else {
            instance = this;
        }

        this.usersController = new UsersController();

        console.log('*** Initializing SocketController');

        this.onConnection = this.onConnection.bind(this);
    }

    onConnection(socket: Socket) {
        console.log('a user connected ' + socket.id);
        socket.on('login', data => this.onLogin(data, socket));
        socket.on('disconnect', () => this.onDisconnent(socket));
    }

    private onLogin(userId: string, socket: Socket) {
        this.socketByUser[userId] = socket;
        this.userBySocket[socket.id] = userId;
        console.log('logged in', userId);
    }

    private onDisconnent(socket: Socket) {
        console.log('a user disconnected ' + socket.id);
        const userId = this.userBySocket[socket.id];
        delete this.socketByUser[userId];
        delete this.userBySocket[socket.id];
        this.usersController.logoutById(userId);
    }
}
