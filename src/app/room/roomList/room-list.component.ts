import { Component, EventEmitter, OnInit, Output, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/Table';
import { Room } from '@app/_models';
import { RoomService } from '../room.service';

const roomList: Room[] = [
    { id: 'Verde1', password: '', isPrivate: false, game: 'Ajedrez', persistent: false, connectedUsers: [{}, {}] },
    { id: 'Verde2', password: '', isPrivate: false, game: 'Ajedrez', persistent: false, connectedUsers: [] },
    { id: 'Verde3', password: '', isPrivate: false, game: 'Ajedrez', persistent: false, connectedUsers: [] },
    { id: 'Verde4', password: '', isPrivate: false, game: 'Ajedrez', persistent: false, connectedUsers: [{}, {}, {}, {}] },
    { id: 'Verde5', password: '', isPrivate: false, game: 'Ajedrez', persistent: false, connectedUsers: [] },
    { id: 'Verde6', password: '', isPrivate: false, game: 'Ajedrez', persistent: false, connectedUsers: [] },
    { id: 'Verde7', password: '', isPrivate: false, game: 'Ajedrez', persistent: false, connectedUsers: [{}, {}, {}] },
    { id: 'Verde8', password: '', isPrivate: false, game: 'Ajedrez', persistent: false, connectedUsers: [] },
    { id: 'Verde1', password: '', isPrivate: false, game: 'Ajedrez', persistent: false, connectedUsers: [{}, {}] },
    { id: 'Verde2', password: '', isPrivate: false, game: 'Ajedrez', persistent: false, connectedUsers: [] },
    { id: 'Verde3', password: '', isPrivate: false, game: 'Ajedrez', persistent: false, connectedUsers: [] },
    { id: 'Verde4', password: '', isPrivate: false, game: 'Ajedrez', persistent: false, connectedUsers: [{}, {}, {}, {}] },
    { id: 'Verde5', password: '', isPrivate: false, game: 'Ajedrez', persistent: false, connectedUsers: [] },
    { id: 'Verde6', password: '', isPrivate: false, game: 'Ajedrez', persistent: false, connectedUsers: [] },
    { id: 'Verde7', password: '', isPrivate: false, game: 'Ajedrez', persistent: false, connectedUsers: [{}, {}, {}] },
    { id: 'Verde8', password: '', isPrivate: false, game: 'Ajedrez', persistent: false, connectedUsers: [] },
    { id: 'Verde1', password: '', isPrivate: false, game: 'Ajedrez', persistent: false, connectedUsers: [{}, {}] },
    { id: 'Verde2', password: '', isPrivate: false, game: 'Ajedrez', persistent: false, connectedUsers: [] },
    { id: 'Verde3', password: '', isPrivate: false, game: 'Ajedrez', persistent: false, connectedUsers: [] },
    { id: 'Verde4', password: '', isPrivate: false, game: 'Ajedrez', persistent: false, connectedUsers: [{}, {}, {}, {}] },
    { id: 'Verde5', password: '', isPrivate: false, game: 'Ajedrez', persistent: false, connectedUsers: [] },
    { id: 'Verde6', password: '', isPrivate: false, game: 'Ajedrez', persistent: false, connectedUsers: [] },
    { id: 'Verde7', password: '', isPrivate: false, game: 'Ajedrez', persistent: false, connectedUsers: [{}, {}, {}] },
    { id: 'Verde8', password: '', isPrivate: false, game: 'Ajedrez', persistent: false, connectedUsers: [] },
];

@Component({
    selector: 'eka-room-list',
    templateUrl: 'room-list.component.html',
    styleUrls: ['room-list.component.scss']
})
export class RoomListComponent implements OnInit{
    @Output() roomSelected: EventEmitter<Room> = new EventEmitter();
    @Output() roomJoined: EventEmitter<Room> = new EventEmitter();
    displayedColumns = ['id', 'game', 'users', 'actions'];
    dataSource: MatTableDataSource<Room> = new MatTableDataSource(roomList);

    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(
        private roomService: RoomService,
        private changeDetectorRef: ChangeDetectorRef
    ) {

    }

    ngOnInit() {
        // this.roomService.getAllRooms().subscribe(rooms => {
        //     this.dataSource = new MatTableDataSource(rooms);
        //     this.dataSource.sort = this.sort;
        //     this.changeDetectorRef.detectChanges();
        // });
        this.dataSource.sort = this.sort;
        // this.dataSource.filter = '4';
    }

    selectRoom(room: Room) {
        this.roomSelected.emit(room);
    }

    joinRoom(event: Event, room: Room) {
        event.stopPropagation();
        this.roomJoined.emit(room);
    }
}
