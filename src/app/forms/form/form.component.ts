import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EkaFormGroup } from '@app/_services';


@Component({
    selector: 'eka-form',
    templateUrl: 'form.component.html',
    styleUrls: ['form.component.scss']
})
export class FormComponent implements OnInit {
    @Input() form: EkaFormGroup;
    @Input() submitOn: string[] = [];
    @Input() loading = false; // TODO: Use it properly.
    @Output() primaryAction = new EventEmitter();
    @Output() secondaryAction = new EventEmitter();
    fields: string[] = [];
    condensed = false;

    ngOnInit() {
        this.fields = Object.keys(this.form.controls);
        this.condensed = !!this.form.data.condensed;
    }

    primaryClick() {
        this.primaryAction.emit(this.form.getRawValue());
    }

    secondaryClick() {
        this.secondaryAction.emit(this.form.getRawValue());
    }

    onKeyUp() {
        if (this.submitOn.includes('keyup')) {
            this.primaryAction.emit(this.form.getRawValue());
        }
    }

    get disabled() {
        return this.form.invalid;
    }

}
