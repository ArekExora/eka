import { Component } from '@angular/core';
import { User } from '@app/_models';
import { UserService } from '@app/_services';

@Component({
  selector: 'eka-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  user: User;

  constructor(
    private userService: UserService
  ) {
    this.userService.user$.subscribe(user => this.user = user);
  }

  logout() {
    this.userService.logout();
  }
}
