import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { EkaFormData, EkaFormModel, FormService } from '../_services';


@Component({
    selector: 'eka-form',
    templateUrl: 'form.component.html',
    styleUrls: ['form.component.scss']
})
export class FormComponent implements OnInit, OnChanges {
    @Input() model: EkaFormModel;
    @Input() errors = [];
    @Input() loading = false;
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
        this.submitted.emit(this.data.form.getRawValue());
    }

    get disabled() {
        return this.data.form.invalid;
    }

}
