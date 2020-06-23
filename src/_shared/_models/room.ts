import { User } from './user';

export class StoredRoom {
    id: string;
    password: string;
    owner: string;
    isPrivate: boolean;
    game: string;
}


export class Room extends StoredRoom {
    persistent: boolean;
    connectedUsers: Partial<User>[];
}
