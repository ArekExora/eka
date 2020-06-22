import { HttpCodes, StoredRoom } from '@server/_models';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { SingletonService } from '../_services';


export class RoomsPersistenceService {
    private roomListMock: StoredRoom[] = [
        { id: 'Roja1', password: '', isPrivate: false, game: 'Ajedrez' },
        { id: 'Roja2', password: '', isPrivate: false, game: 'Ajedrez' },
        { id: 'Roja3', password: '', isPrivate: false, game: 'Ajedrez' },
        { id: 'Roja4', password: '', isPrivate: false, game: 'Ajedrez' },
        { id: 'Roja5', password: '', isPrivate: false, game: 'Ajedrez' },
        { id: 'Roja6', password: '', isPrivate: false, game: 'Ajedrez' },
        { id: 'Roja7', password: '', isPrivate: false, game: 'Ajedrez' },
        { id: 'Roja8', password: '', isPrivate: false, game: 'Ajedrez' },
    ];

    constructor(){
        // Singleton not required! (When DB is working)
        const instance = SingletonService.get(this);
        if (instance) {
            return instance;
        }
        console.log('*** Initializing RoomsPersistenceService');
    }

    getAll() {
        return of(this.roomListMock);
    }

    insert(room: StoredRoom): Observable<boolean> {
        if (!room) {
            return throwError(HttpCodes.Bad_Request);
        }

        return this.idExists(room.id).pipe(
            map(taken => {
                if (taken) {
                    throw { code: HttpCodes.Conflict };
                }
                this.roomListMock.push(this.adaptToDB(room));
                return true;
            })
        );
    }

    update(changes: Partial<StoredRoom>): Observable<StoredRoom> {
        if (!changes || !changes.id) {
            return throwError(HttpCodes.Bad_Request);
        }

        const room = this.roomListMock.find(u => u.id === changes.id);
        if (room) {
            return of(Object.assign(room, changes));
        }
        return throwError(HttpCodes.Not_Found);
    }

    idExists(id: string): Observable<boolean> {
        return of(!!this.roomListMock.find(room => room.id === id));
    }

    private adaptToDB(room: StoredRoom): StoredRoom {
        const { id, password, isPrivate, game } = room;
        return { id, password, isPrivate, game };
    }
}
