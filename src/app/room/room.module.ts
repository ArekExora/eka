import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RoomComponent } from './room.component';
import { RoomRoutingModule } from './room-routing.module';
import { RoomService } from './room.service';

@NgModule({
    declarations: [
        RoomComponent,
    ],
    providers: [
        RoomService,
    ],
    imports: [
        CommonModule,
        RoomRoutingModule,
    ]
})
export class RoomModule { }
