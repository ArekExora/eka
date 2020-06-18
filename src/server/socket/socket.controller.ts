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
        this.register(socket, socket.handshake.query.userId);

        socket.on('disconnect', () => this.onDisconnent(socket));
        socket.on('join_room_request', room => this.handleRoom(socket, room, 'join'));
        socket.on('leave_room_request', room => this.handleRoom(socket, room, 'leave'));
        socket.on('error', error => console.error(`Socket error: ${error}`));

        this.io.sockets.emit('user_count', ++this.connectedUsers);
    }

    private register(socket: Socket, userId: string): void {
        const user = this.usersController.getUser(userId);
        if (!user) {
            console.error(`Received socket login event from unconnected user '${userId}'`);
            socket.disconnect(true);
            return;
        }
        user.socket = socket;
        socket.user = user;
        console.log(`Socket login (${user.username})`);
    }

    private onDisconnent(socket: Socket): void {
        // Avoid crashing when user not properly setup.
        if (!socket.user) {
            console.error(`Socket disconnected without user (${socket.id})`);
            return;
        }
        console.log(`Socket disconnected '${socket.id}'`);
        this.usersController.logoutById(socket.user.id);
        this.io.sockets.emit('user_count', --this.connectedUsers);
    }

    private handleRoom(socket: Socket, roomName: string, action: 'join' | 'leave') {
        if (!roomName) {
            console.error(`*** ERROR: User ${socket.user.username} failed to provide a room name`);
            socket.emit('client_error', 'No room name provided!');
            return console.error('No room name provided!');
        }

        const userCount = this.roomsController[`${action}Room`](socket.user, roomName);
        if (userCount >= 0) {
            socket[action](roomName, () => {
                socket.emit(`${action}_room`, roomName);
                this.io.to(roomName).emit('room_change', { message: `User ${socket.user.username} ${action} the room`, userCount });
            });
        } else {
            console.error(`*** ERROR: User ${socket.user.username} was unable to ${action} the room ${roomName}`);
            socket.emit('client_error', `Unable to ${action} the room ${roomName}`);
        }
    }
}
