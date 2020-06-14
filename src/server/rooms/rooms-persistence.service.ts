import { HttpCodes, User, Room } from '@server/_models';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

export class RoomsPersistenceService {
    private roomListMock: Room[] = [];

    constructor(){
        console.log('*** Initializing RoomsPersistenceService');
    }

    getById(id: string): Observable<Room> {
        const room = this.roomListMock.find(u => u.id === id);
        return room ? of(room) : throwError(HttpCodes.Not_Found);
    }

    insert(room: Room): Observable<Room> {
        if (!room) {
            return throwError(HttpCodes.Bad_Request);
        }

        return this.idExists(room.id).pipe(
            map(taken => {
                if (taken) {
                    throw { code: HttpCodes.Conflict };
                }
                this.roomListMock.push(room);
                return room;
            })
        );
    }

    update(changes: Partial<Room>): Observable<Room> {
        if (!changes || !changes.id) {
            return throwError(HttpCodes.Bad_Request);
        }

        return this.getById(changes.id).pipe(
            map(room => Object.assign(room, changes))
        );
    }

    idExists(id: string): Observable<boolean> {
        return of(!!this.roomListMock.find(room => room.id === id));
    }
}
