import { HttpCodes, StoredRoom } from '@server/_models';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { SingletonService } from '../_services';


export class RoomsPersistenceService {
    private roomListMock: StoredRoom[] = [
        { id: 'Roja1', password: '', owner: 'test', isPrivate: false, game: 'Ajedrez' },
        { id: 'Roja2', password: '', owner: 'test2', isPrivate: false, game: 'Damas' },
        { id: 'Roja3', password: '', owner: 'test3', isPrivate: false, game: 'Ajedrez' },
        { id: 'Roja4', password: '', owner: 'test4', isPrivate: false, game: 'Ajedrez' },
        { id: 'Roja5', password: '', owner: 'test', isPrivate: false, game: 'Damas' },
        { id: 'Roja6', password: '', owner: 'test2', isPrivate: false, game: 'Ajedrez' },
        { id: 'Roja7', password: '', owner: 'test3', isPrivate: false, game: 'Dardos' },
        { id: 'Roja8', password: '', owner: 'test4', isPrivate: false, game: 'Ajedrez' },
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
        const { id, password, owner, isPrivate, game } = room;
        return { id, password, owner, isPrivate, game };
    }
}
