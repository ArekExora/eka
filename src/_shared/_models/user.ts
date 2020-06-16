export class User {
    id: string;
    username: string;
    email: string;
    password?: string;
    token?: string;

    static requiredFieldsOnly({ id, username, email }: User): User {
        return { id, username, email };
    }
}
