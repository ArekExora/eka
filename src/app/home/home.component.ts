import { Component } from '@angular/core';
import { User } from '@app/_models';
import { UserService } from '@app/_services';


@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    user: User;

    constructor(userService: UserService) {
        this.user = userService.userValue;
    }
}
