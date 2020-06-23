import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { EkaFormData, EkaFormModel, FormService } from '../_services';


@Component({
    selector: 'eka-condensed-form',
    templateUrl: 'condensed-form.component.html',
    styleUrls: ['condensed-form.component.scss']
})
export class CondensedFormComponent implements OnInit, OnChanges {
    @Input() model: EkaFormModel;
    @Input() errors = [];
    @Input() submitOn: string[] = [];
    @Output() submitted = new EventEmitter();
    data: EkaFormData;
    fields: string[] = [];

    constructor(
        private formService: FormService,
    ) { }

    ngOnInit() {
        this.data = this.formService.parseData(this.model);
        this.fields = Object.keys(this.data.form.controls);
    }

    ngOnChanges({ errors }: SimpleChanges) {
        (errors && errors.currentValue || []).forEach(error => {
            this.data.form.get(error.field).setErrors({ [error.type]: true });
        });
    }

    onSubmit() {
        this.sendData();
    }

    onKeyUp() {
        if (this.submitOn.includes('keyup')) {
            this.sendData();
        }
    }

    private sendData() {
        this.submitted.emit(this.data.form.getRawValue());
    }

    get disabled() {
        return this.data.form.invalid;
    }

}
