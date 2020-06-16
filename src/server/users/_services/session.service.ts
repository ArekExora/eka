import { SingletonService } from '@server/_services';
import { User } from '@server/_models';

export class SessionService {

    constructor(

    ) {
        // Singleton not required!
        const instance = SingletonService.get(this);
        if (instance) {
            return instance;
        }
        console.log('*** Initializing SessionService');
    }

    generateToken(user: User) {
        return 'TOKEN';
    }

}
