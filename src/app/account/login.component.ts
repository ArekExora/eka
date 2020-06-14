import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpCodes } from '@app/_models';
import { AlertService, UserService } from '@app/_services';


@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {
    heading: string;
    action: string;
    returnUrl: string;
    loading = false;
    errors = [];
    formData: any;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.action = this.route.snapshot.data.action;
        this.heading = this.action === 'register' ? 'Register' : 'Login';
        this.formData = {
            primaryText: this.heading,
            fields: this.action === 'register' ? ['username', 'email', 'password', 'password2'] : ['username', 'password']
        };
        this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
    }

    onSubmit(data: any) {
        // reset alerts on submit
        this.alertService.clear();

        // verify the data.
        if (!this.isDataValid(data)) {
            return;
        }

        this.loading = true;
        this.userService[this.action](data)
            .subscribe(
                user => {
                    this.alertService.success(`Welcome ${user.username}`, { autoClose: true, keepAfterRouteChange: true });
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.handleError(error);
                    this.loading = false;
                });
    }

    private isDataValid(data: any) {
        // verify both passwords are the same.
        if (this.action === 'register' && data.password !== data.password2) {
            this.alertService.error('Passwords don\'t match!', { autoClose: true });
            this.errors = [{ field: 'password2', type: 'generic' }];
            return false;
        }
        return true;
    }

    private handleError(error) {
        switch (error.status) {
            case HttpCodes.Conflict: this.errors = error.error.split(',').map(field => ({ field, type: 'duplicated' })); break;
            case HttpCodes.Bad_Request: this.errors = error.error.split(',').map(field => ({ field, type: 'pattern' })); break;
            case HttpCodes.WrongPassword: this.alertService.error('Username or password not correct.', { autoClose: true }); break;
            case HttpCodes.Not_Found: this.alertService.error('Service temporarily unavailable.', { autoClose: true }); break;
            case HttpCodes.Internal_Error: this.alertService.error('Unexpected error, please try again.', { autoClose: true }); break;
            default: this.alertService.error(error.message || error, { autoClose: true });
        }
    }
}
