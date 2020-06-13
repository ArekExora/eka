import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpCodes } from '@app/_models';
import { AlertService, UserService } from '@app/_services';


@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {
    heading = 'Login';
    action = 'login';
    returnUrl: string;
    loading = false;
    errors = [];
    data = {
        primaryText: this.heading,
        fields: ['username', 'password']
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

        this.loading = true;
        this.userService.login(data)
            .subscribe(
                () => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.handleError(error);
                    this.loading = false;
                });
    }

    private handleError(error) {
        switch (error.status) {
            case HttpCodes.Bad_Request: this.alertService.error('Username or password not correct.', { autoClose: true }); break;
            case HttpCodes.Not_Found: this.alertService.error('Service temporarily unavailable.', { autoClose: true }); break;
            case HttpCodes.Internal_Error: this.alertService.error('Unexpected error, please try again.', { autoClose: true }); break;
            default: this.alertService.error(error.message || error, { autoClose: true });
        }
    }
}
