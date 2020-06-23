import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { CondensedFormComponent } from './condensedForm';
import { DynamicInputDirective } from './dynamic-input.directive';
import { FormComponent } from './form';
import { InputComponent } from './input';
import { GenericInputComponent } from './input/generic-input.component';
import { FormService } from './_services/form.service';


@NgModule({
    declarations: [
        FormComponent,
        CondensedFormComponent,
        InputComponent,
        GenericInputComponent,
        DynamicInputDirective
    ],
    entryComponents: [
        InputComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MaterialModule,
    ],
    exports: [
        FormComponent,
        CondensedFormComponent,
    ],
    providers: [
        FormService
    ]
})
export class EkaFormsModule { }
