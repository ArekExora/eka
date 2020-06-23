import { Component } from '@angular/core';
import { Room } from '@app/_models';
import { SocketService } from '../_services';


@Component({
    templateUrl: 'room.component.html',
    styleUrls: ['room.component.scss']
})
export class RoomComponent {
    connectedUsers = 1;

    constructor(
        private socketService: SocketService
    ) {
        socketService.getUserCount().subscribe(count => this.connectedUsers = count);
    }

    joinRoom(room: Room) {
        console.log('Trying to join room ' + room.id);
        this.socketService.joinRoom(room.id);
    }

    leaveRoom(room: Room) {
        console.log('Trying to leave room ' + room.id);
        this.socketService.leaveRoom(room.id);
    }

}
