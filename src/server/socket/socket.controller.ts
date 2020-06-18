import { User } from '@server/_models';
import { Server } from 'socket.io';
import { RoomsController } from '../rooms';
import { UsersController } from '../users';
import { SingletonService } from '../_services';

interface Socket extends SocketIO.Socket {
    user?: User;
}

export class SocketController {
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

        io.on('connection', socket => this.onConnection(socket));
    }

    private onConnection(socket: Socket): void {
        console.log(`Socket connected '${socket.id}'`);

        socket.on('login', data => this.onLogin(socket, data));
        socket.on('disconnect', () => this.onDisconnent(socket));
        socket.on('join_room', room => this.handleRoom(socket, room, 'join'));
        socket.on('leave_room', room => this.handleRoom(socket, room, 'leave'));

        this.io.sockets.emit('user_count', ++this.connectedUsers);
    }

    private onLogin(socket: Socket, userId: string): void {
        const user = this.usersController.getUser(userId);
        if (!user) {
            console.error(`Received socket login event from unconnected user '${userId}'`);
            return;
        }
        user.socket = socket;
        socket.user = user;
        console.log(`Socket login '${userId}'`);
    }

    private onDisconnent(socket: Socket): void {
        console.log(`Socket disconnected '${socket.id}'`);
        this.usersController.logoutById(socket.user.id);
        this.io.sockets.emit('user_count', --this.connectedUsers);
    }

    private handleRoom(socket: Socket, roomName: string, action: 'join' | 'leave') {
        if (!roomName) {
            return console.error('No room name provided!');
        } else if (!['join', 'leave'].includes(action)) {
            return console.error(`Invalid action sent: '${action}'`);
        }

        const userCount = this.roomsController[`${action}Room`](socket.user, roomName);
        if (userCount >= 0) {
            socket[action](roomName, () => {
                socket.emit(`${action}_room`, roomName);
                this.io.to(roomName).emit('room_change', { message: `User ${socket.user.username} ${action} the room`, userCount });
            });
        } else {
            socket.emit('error', `Unable to ${action} the room ${roomName}`);
        }
    }
}
