import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { Room } from '@app/_models';

@Injectable()
export class RoomService {

    private url = `${environment.apiUrl}/rooms`;

    constructor(
        private http: HttpClient,
    ) {}

    getAllRooms(): Observable<Room[]> {
        return this.http.get(`${this.url}/list`) as any;
    }

    getRoomDetails(id: string): Observable<Room> {
        return this.http.get(`${this.url}/details/${id}`) as any;
    }

    createRoom({ id, password = '', game = 'Sudoku' }): Observable<Room> {
        return this.http.post(`${this.url}/create`, { id, password, game }) as any;
    }
}
