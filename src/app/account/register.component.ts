import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpCodes } from '@app/_models';
import { AlertService, UserService } from '@app/_services';


@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})
export class RegisterComponent implements OnInit {
    heading = 'Register';
    action = 'register';
    returnUrl: string;
    loading = false;
    errors = [];
    data = {
        primaryText: this.heading,
        fields: ['username', 'email', 'password', 'password2']
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
    }

    onSubmit(data: any) {
        // reset alerts on submit
        this.alertService.clear();

        // verify both passwords are the same.
        if (data.password !== data.password2) {
            this.alertService.error('Passwords don\'t match!', { autoClose: true });
            this.errors = [{ field: 'password2', type: 'generic' }];
            return;
        }

        this.loading = true;
        this.userService.register(data)
            .subscribe(
                () => {
                    this.alertService.success('Registration successful', { keepAfterRouteChange: true });
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.handleError(error);
                    this.loading = false;
                });
    }

    private handleError(error) {
        switch (error.status) {
            case HttpCodes.Conflict: this.errors = error.error.split(',').map(field => ({ field, type: 'duplicated' })); break;
            case HttpCodes.Bad_Request: this.errors = error.error.split(',').map(field => ({ field, type: 'pattern' })); break;
            case HttpCodes.Not_Found: this.alertService.error('Service temporarily unavailable.', { autoClose: true }); break;
            case HttpCodes.Internal_Error: this.alertService.error('Unexpected error, please try again.', { autoClose: true }); break;
            default: this.alertService.error(error.message || error, { autoClose: true });
        }
    }
}
