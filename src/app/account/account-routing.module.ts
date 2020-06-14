import { LoggedinGuard } from './loggedin.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [LoggedinGuard],
        children: [
            {
                 path: 'login',
                 data: { action: 'login' },
                 component: LoginComponent
            },
            {
                 path: 'register',
                 data: { action: 'register' },
                 component: LoginComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountRoutingModule { }
