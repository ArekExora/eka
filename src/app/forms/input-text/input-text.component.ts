import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { EkaFieldData } from '@app/_services';
import { FieldInterface } from '../field.interface';


@Component({
    selector: 'eka-text-input',
    templateUrl: 'input-text.component.html',
    styleUrls: ['input-text.component.scss']
})
export class InputTextComponent implements FieldInterface, OnInit {
    @Input() form: FormGroup;
    @Input() selector: string;
    required = false;
    show = false;

    ngOnInit() {
        this.required =  !!(this.data.validators || []).find(fn => fn.name === 'required');
    }

    get control(): AbstractControl {
        return this.form.get(this.selector);
    }

    get data(): EkaFieldData {
        return (this.control as any).data;
    }

    get errors(): string[] {
        return Object.keys(this.control.errors || {})
            .map(key => this.data.errorMessages[key])
            .filter(msg => !!msg);
    }

}
