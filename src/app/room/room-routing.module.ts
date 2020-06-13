import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomComponent } from './room.component';


const routes: Routes = [
    {
        path: '',
        component: RoomComponent,
        // children: [
        //     {
        //          path: 'login',
        //          component: LoginComponent
        //     },
        //     {
        //          path: 'register',
        //          component: RegisterComponent
        //     }
        // ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoomRoutingModule { }
