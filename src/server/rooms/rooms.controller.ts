
import { Request, Response } from 'express';
import { HttpCodes } from '@server/_models';

export class RoomsController {
    constructor() {
        console.log('*** Initializing RoomsController');

        this.create = this.create.bind(this);
    }

    create(request: Request, response: Response): void {
        console.log('CREAMOS UNA SALA');
        response.status(HttpCodes.OK).send();
    }
}
