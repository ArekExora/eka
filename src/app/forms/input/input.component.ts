import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { FieldInterface } from '../field.interface';
import { EkaFormField } from '../_services';


@Component({
    selector: 'eka-input',
    templateUrl: 'input.component.html',
    styleUrls: ['input.component.scss']
})
export class InputComponent implements FieldInterface, OnInit {
    @Input() form: FormGroup;
    @Input() selector: string;
    required = false;
    show = false;

    public get data(): EkaFormField {
        return (this.control as any).data;
    }

    ngOnInit() {
        this.required =  !!(this.data.validators || []).find(fn => fn.name === 'required');
    }

    get errors(): string[] {
        const errors = this.control.errors;
        return Object.keys(errors || {})
            .map(key => this.data.errorMessages[key])
            .filter(msg => !!msg);
    }

    private get control(): AbstractControl {
        return this.form.get(this.selector);
    }

}
