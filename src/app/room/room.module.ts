import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RoomComponent } from './room.component';
import { RoomRoutingModule } from './room-routing.module';

@NgModule({
    declarations: [
        RoomComponent,
    ],
    imports: [
        CommonModule,
        RoomRoutingModule,
    ]
})
export class RoomModule { }
