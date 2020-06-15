import { single } from 'rxjs/operators';

const singletonList = {};

export class SingletonService {

    static get(service: any): any {
        const name = service.constructor.name;

        if (singletonList[name]) {
            console.log(`Retrieving existing instance of ${name}`);
            return singletonList[name];
        }

        console.log(`Storing new instance of ${name}`);
        singletonList[name] = service;
        return false;
    }

}
