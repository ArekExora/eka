import { AfterViewInit, Component, EventEmitter, Output, ViewChild, OnDestroy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/Table';
import { Room } from '@app/_models';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
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
];

@Component({
    selector: 'eka-room-list',
    templateUrl: 'room-list.component.html',
    styleUrls: ['room-list.component.scss']
})
export class RoomListComponent implements AfterViewInit, OnDestroy{
    @ViewChild(MatSort) sort: MatSort;

    @Output() roomSelected: EventEmitter<Room> = new EventEmitter();
    @Output() roomJoined: EventEmitter<Room> = new EventEmitter();

    displayedColumns = ['id', 'game', 'users', 'actions'];
    dataSource: MatTableDataSource<Room> = new MatTableDataSource<Room>();

    private loadingSubject = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();

    constructor(
        private roomService: RoomService
    ) {
        this.dataSource.sortingDataAccessor = this.sortingDataAccessorFn;
        this.loadRooms();
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    ngOnDestroy() {
        this.loadingSubject.complete();
    }

    selectRoom(room: Room) {
        this.roomSelected.emit(room);
    }

    joinRoom(event: Event, room: Room) {
        event.stopPropagation();
        this.roomJoined.emit(room);
    }

    loadRooms() {
        this.loadingSubject.next(true);

        this.roomService.getAllRooms().pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(rooms => this.dataSource.data = rooms);
    }

    private sortingDataAccessorFn(room: Room, sortHeaderId: string) {
        switch (sortHeaderId) {
            case 'users':
                return room.connectedUsers.length;
            default:
                return room[sortHeaderId];
        }
    }
}
