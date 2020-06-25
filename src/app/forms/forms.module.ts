import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { FormComponent } from './form';
import { GenericInputComponent } from './generic-input.component';
import { InputTextComponent } from './input-text';


@NgModule({
    declarations: [
        FormComponent,
        InputTextComponent,
        GenericInputComponent,
    ],
    entryComponents: [
        InputTextComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MaterialModule,
    ],
    exports: [
        FormComponent,
    ]
})
export class EkaFormsModule { }
