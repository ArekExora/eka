import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';


@Component({
    selector: 'eka-input',
    templateUrl: 'input.component.html',
    styleUrls: ['input.component.scss']
})
export class InputComponent implements OnInit {
    @Input() form: FormGroup;
    @Input() model: any;
    inputType: string;

    constructor() { }

    ngOnInit() {
        this.inputType = this.model.type;
    }

    showPassword() {
        this.inputType = 'text';
    }

    hidePassword() {
        this.inputType = this.model.type;
    }

    resetValue() {
        this.control.setValue('');
    }

    get value(): string {
        return this.control.value;
    }

    get errors(): string[] {
        const errors = this.control.errors;
        return Object.keys(errors || {})
            .map(key => this.model.errorMessages[key])
            .filter(msg => !!msg);
    }

    private get control(): AbstractControl {
        return this.form.get(this.model.selector);
    }

}
