export class StoredRoom {
    id: string;
    password: string;
    isPrivate: boolean;
    game: string;
}


export class Room extends StoredRoom {
    persistent: boolean;
    connectedUsers: number;
}
