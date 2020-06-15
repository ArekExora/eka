import { HttpCodes, Room } from '@server/_models';
import { Request, Response } from 'express';
import { SocketController } from '../socket/socket.controller';
import { SingletonService } from '../_services';
import { RoomsPersistenceService } from './rooms-persistence.service';


export class RoomsController {
    private roomList: Room[] = [
        { id: 'Verde', password: '', isPrivate: false, game: 'Ajedrez', persistent: false, connectedUsers: 0 }
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
        this.getRoom = this.getRoom.bind(this);

        this.loadRoomsFromDB();
    }

    private loadRoomsFromDB() {
        this.roomsPersistenceService.getAll()
            .subscribe(rooms => this.roomList.push(...rooms.map(this.adaptToService)));
    }

    private adaptToService(room: Room): Room {
        const { id, password, isPrivate, game } = room;
        return { id, password, isPrivate, game, persistent: true, connectedUsers: 0 };
    }

    create({ body }: Request, response: Response): void {
        const { id, password = '', game } = body;
        if (this.roomList.find(r => r.id === id)) {
            response.status(HttpCodes.Bad_Request).send('Room ID in use.');
        }
        console.log('CREAMOS UNA SALA');
        const room = { id, password, isPrivate: false, game, persistent: false, connectedUsers: 0 };
        this.roomList.push(room);
        response.status(HttpCodes.OK).send(room);
    }

    getRoomList(_: Request, response: Response): void {
        response.status(HttpCodes.OK).send(this.roomList);
    }

    getRoom({ params }: Request, response: Response): void {
        const room = this.roomList.find(r => r.id === params.id);
        if (room) {
            response.status(HttpCodes.OK).send(room);
        } else {
            response.status(HttpCodes.Bad_Request).send('Room ID not found.');
        }
    }

    joinRoom(userId: string, roomName: string): boolean {
        return true;
    }

    leaveRoom(userId: string, roomName: string): boolean {
        return true;
    }
}
