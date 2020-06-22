import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@app/material.module';
import { RoomRoutingModule } from './room-routing.module';
import { RoomComponent } from './room.component';
import { RoomService } from './room.service';
import { RoomListComponent } from './roomList';

@NgModule({
    declarations: [
        RoomListComponent,
        RoomComponent,
    ],
    providers: [
        RoomService,
    ],
    imports: [
        CommonModule,
        RoomRoutingModule,
        MaterialModule
    ]
})
export class RoomModule { }
