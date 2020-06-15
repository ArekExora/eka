import { Server, Socket } from 'socket.io';
import { RoomsController } from '../rooms';
import { UsersController } from '../users';
import { SingletonService } from '../_services';


export class SocketController {
    private socketByUser: { [userId: string]: Socket } = {};
    private userBySocket: { [socketId: string]: string } = {};
    private connectedUsers = 0;

    constructor(
        private io: Server,
        private usersController = new UsersController(),
        private roomsController = new RoomsController()
    ) {
        const instance = SingletonService.get(this);
        if (instance) {
            return instance;
        }
        console.log('*** Initializing SocketController');

        io.on('connection', this.onConnection.bind(this));
    }

    private onConnection(socket: Socket) {
        console.log('a user connected ' + socket.id);
        socket.on('login', data => this.onLogin(data, socket));
        socket.on('disconnect', () => this.onDisconnent(socket));
        socket.on('join_room', room => this.handleRoom(this.userBySocket[socket.id], room, 'join'));
        socket.on('leave_room', room => this.handleRoom(this.userBySocket[socket.id], room, 'leave'));
        this.io.sockets.emit('user_count', ++this.connectedUsers);
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
        this.io.sockets.emit('user_count', --this.connectedUsers);
    }

    private handleRoom(userId: string, roomName: string, action: 'join' | 'leave') {
        const socket = this.socketByUser[userId];
        if (!socket) {
            return console.error(`No socket found for user ${userId}`);
        } else if (!roomName) {
            return console.error('No room name provided!');
        } else if (!['join', 'leave'].includes(action)) {
            return console.error(`Invalid action sent: '${action}'`);
        }

        if (this.roomsController[`${action}Room`](userId, roomName)) {
            socket[action](roomName, () => {
                socket.emit(`${action}_room`, roomName);
                this.io.to(roomName).emit('room_change', `A user ${action} the room`);
            });
        } else {
            socket.emit('error', `Unable to ${action} the room ${roomName}`);
        }
    }
}
