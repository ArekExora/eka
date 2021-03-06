import { HttpCodes, Room, User } from '@server/_models';
import { Request, Response } from 'express';
import { SingletonService } from '../_services';
import { RoomsPersistenceService } from './rooms-persistence.service';


export class RoomsController {
    private roomList: Room[] = [
        { id: 'Verde1', password: '', owner: 'test', isPrivate: false, game: 'Sudoku',
            description: 'Un mágico mundo de ilusión y felicidad.', persistent: false, connectedUsers: [] },
        { id: 'Verde2', password: '', owner: 'test2', isPrivate: false, game: 'Ajedrez', persistent: false, connectedUsers: [] },
        { id: 'Verde3', password: '', owner: 'test3', isPrivate: false, game: 'Ajedrez', persistent: false, connectedUsers: [] },
        { id: 'Verde4', password: '', owner: 'test4', isPrivate: false, game: 'Parchis', persistent: false, connectedUsers: [] },
        { id: 'Verde5', password: '', owner: 'test', isPrivate: false, game: 'Ajedrez', persistent: false, connectedUsers: [] },
        { id: 'Verde6', password: '', owner: 'test2', isPrivate: false, game: 'Sudoku', persistent: false, connectedUsers: [] },
        { id: 'Verde7', password: '', owner: 'test3', isPrivate: false, game: 'Ajedrez', persistent: false, connectedUsers: [] },
        { id: 'Verde8', password: '', owner: 'test4', isPrivate: false, game: 'Ajedrez', persistent: false, connectedUsers: [] },
    ];

    constructor(
        private roomsPersistenceService = new RoomsPersistenceService()
    ) {
        const instance = SingletonService.get(this);
        if (instance) {
            return instance;
        }
        console.log('*** Initializing RoomsController');

        this.create = this.create.bind(this);
        this.getRoomList = this.getRoomList.bind(this);
        this.getRoom = this.getRoom.bind(this); // Probably not usefull.

        this.loadRoomsFromDB();
    }

    private loadRoomsFromDB() {
        this.roomsPersistenceService.getAll()
            .subscribe(rooms => this.roomList.push(...rooms.map(this.adaptToService)));
    }

    private adaptToService(room: Room): Room {
        const { id, password, owner, isPrivate, game, description } = room;
        return { id, password, owner, isPrivate, game, description, persistent: true, connectedUsers: [] };
    }

    // TODO: Use proper error handling.
    create({ body }: Request, response: Response): void {
        const { id, password = '', game } = body;
        if (this.roomList.find(r => r.id === id)) {
            response.status(HttpCodes.Conflict).send('Room ID in use.');
        }
        console.log('CREAMOS UNA SALA');
        const room = { id, password, owner: 'FAKE OWNER', isPrivate: false, game, persistent: false, connectedUsers: [] };
        this.roomList.push(room);
        response.status(HttpCodes.OK).send(room);
    }

    getRoomList(_: Request, response: Response): void {
        response.status(HttpCodes.OK).send(this.roomList);
    }

    // TODO: Use proper error handling.
    getRoom({ params }: Request, response: Response): void {
        const room = this.roomList.find(r => r.id === params.id);
        if (room) {
            response.status(HttpCodes.OK).send(room);
        } else {
            response.status(HttpCodes.Not_Found).send('Room ID not found.');
        }
    }

    joinRoom(user: User, roomName: string): number {
        const room = this.roomList.find(r => r.id === roomName);
        if (!room || user.room || room.connectedUsers.includes(user)) {
            return -1;
        }

        user.room = roomName;
        room.connectedUsers.push({ username: user.username, id: user.id });
        return room.connectedUsers.length;
    }

    leaveRoom(user: User, roomName: string): number {
        const room = this.roomList.find(r => r.id === roomName);
        if (!room || !user.room || !room.connectedUsers.includes(user)) {
            return -1;
        }

        user.room = '';
        room.connectedUsers = room.connectedUsers.filter(u => u.id !== user.id);
        return room.connectedUsers.length;
    }
}
