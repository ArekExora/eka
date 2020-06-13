import { CommonModule } from '@angular/common';
import { LoggedinGuard } from './loggedin.guard';
import { NgModule } from '@angular/core';
import { EkaFormsModule } from '@app/forms';
import { AccountRoutingModule } from './account-routing.module';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';


@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
    ],
    providers: [
        LoggedinGuard
    ],
    imports: [
        CommonModule,
        AccountRoutingModule,
        EkaFormsModule,
    ]
})
export class AccountModule { }
