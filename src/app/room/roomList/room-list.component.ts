import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/Table';
import { Room } from '@app/_models';
import { EkaFormGroup, FormService } from '@app/_services';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { RoomService } from '../room.service';

@Component({
    selector: 'eka-room-list',
    templateUrl: 'room-list.component.html',
    styleUrls: ['room-list.component.scss'],
    animations: [
      trigger('expand', [
        state('collapsed', style({ height: '0px' })),
        state('expanded', style({ height: '48px' })),
        state('expandedDouble', style({ height: '96px' })),
        transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        transition('expandedDouble <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
      ])
    ]
})
export class RoomListComponent implements AfterViewInit, OnDestroy{
    @ViewChild(MatSort) sort: MatSort;
    @Output() roomJoined: EventEmitter<Room> = new EventEmitter();

    displayedColumns = ['id', 'game', 'users', 'actions'];
    detailColumns = ['owner', 'description'];
    isFiltering = false;
    isAdding = false;
    selectedRoom: Room = null;
    dataSource: MatTableDataSource<Room> = new MatTableDataSource<Room>();
    searchForm: EkaFormGroup;

    private loadingSubject = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();

    constructor(
        private roomService: RoomService,
        formService: FormService
    ) {
        this.searchForm = formService.generateForm('room_search');
        this.dataSource.sortingDataAccessor = this.sortingDataAccessorFn;
        this.dataSource.filterPredicate = this.filterPredicateFn;
        this.loadRooms();
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    ngOnDestroy() {
        this.loadingSubject.complete();
    }

    selectRoom(room: Room) {
        this.selectedRoom = this.selectedRoom === room ? null : room;
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

    filter(data: any) {
        this.dataSource.filter = data;
    }

    toggleFiltering() {
        this.isFiltering = !this.isFiltering;
        this.isAdding = false;
        this.clearFilter();
    }

    toogleAdding() {
        this.isAdding = !this.isAdding;
        this.isFiltering = false;
        this.clearFilter();
    }

    private clearFilter() {
        this.searchForm.patchValue({ name: '', owner: '', game: '' });
        this.dataSource.filter = '';
    }

    private sortingDataAccessorFn(room: Room, sortHeaderId: string) {
        switch (sortHeaderId) {
            case 'users':
                return room.connectedUsers.length;
            default:
                return room[sortHeaderId];
        }
    }

    private filterPredicateFn(room: Room, filter: any): boolean {
        const { name, owner, game } = filter;

        return room.id.toLowerCase().includes(name.toLowerCase())
            && room.owner.toLowerCase().includes(owner.toLowerCase())
            && room.game.toLowerCase().includes(game.toLowerCase());
    }
}
