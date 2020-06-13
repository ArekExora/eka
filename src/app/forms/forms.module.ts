import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { FormComponent } from './form';
import { InputComponent } from './input';
import { FormService } from './_services/form.service';


@NgModule({
    declarations: [
        FormComponent,
        InputComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MaterialModule,
    ],
    exports: [
        FormComponent,
    ],
    providers: [
        FormService
    ]
})
export class EkaFormsModule { }
