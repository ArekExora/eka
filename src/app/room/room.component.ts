import { Component } from '@angular/core';


@Component({
    templateUrl: 'room.component.html',
    styleUrls: ['room.component.scss']
})
export class RoomComponent {
    roomList = ['azul', 'verde', 'roja'];

    constructor(
    ) { }

}
