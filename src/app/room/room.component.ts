import { Component, OnInit } from '@angular/core';
import { Room } from '@app/_models';
import { SocketService } from '../_services';
import { RoomService } from './room.service';


@Component({
    templateUrl: 'room.component.html',
    styleUrls: ['room.component.scss']
})
export class RoomComponent implements OnInit {
    roomList: Room[];
    selectedRoom: Room = null;
    connectedUsers = 1;

    constructor(
        private roomService: RoomService,
        private socketService: SocketService
    ) {
        socketService.getUserCount().subscribe(count => this.connectedUsers = count);
     }

    ngOnInit(): void {
        this.roomService.getAllRooms().subscribe(rooms => this.roomList = rooms);
    }

    selectRoom(room) {
        this.selectedRoom = room;
    }

    joinRoom(room) {
        console.log('Trying to join room ' + room.id);
        this.socketService.joinRoom(room.id);
    }

    leaveRoom(room) {
        console.log('Trying to leave room ' + room.id);
        this.socketService.leaveRoom(room.id);
    }

}
