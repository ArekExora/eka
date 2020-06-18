import { Socket } from 'socket.io';


export class User {
    id: string;
    username: string;
    email: string;
    password?: string;
    token?: string;
    socket?: Socket;
    room?: string;

    static requiredFieldsOnly({ id, username, email }: User): User {
        return { id, username, email };
    }
}
