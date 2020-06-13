import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class EkaFormField {
    selector: string;
    label: string;
    type?: string;
    value?: string;
    validators?: Validators[];
    errorMessages?: { [key: string]: string };
}

export class EkaFormModel {
    primaryText: string;
    secondaryText?: string;
    fields: string[];
}

export class EkaFormData {
    form: FormGroup;
    primaryText: string;
    secondaryText?: string;
    fields: EkaFormField[];
}

const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

@Injectable()
export class FormService {

    constructor(
        private formBuilder: FormBuilder,
    ) { }

    parseData(data: EkaFormModel): EkaFormData {
        const { primaryText, secondaryText, fields: fieldsData } = data;
        const fields = fieldsData.map(f => this.generateField(f));
        const formData = fields
            .reduce((fData, f) => { fData[f.selector] = [f.value || '', f.validators]; return fData; }, {});

        return {
            primaryText,
            secondaryText,
            form: this.formBuilder.group(formData),
            fields
        };
    }

    private generateField(name: string): EkaFormField {
        switch (name) {
            case 'username': return this.generateTextField(name, 'Username', true);
            case 'email': return this.generateEmailField(name, 'Email', true);
            // case 'email2': return this.generateEmailField(name, 'Email confirmation', true);
            case 'password': return this.generatePasswordField(name, 'Password', true);
            case 'password2': return this.generatePasswordField(name, 'Password confirmation', true);
        }
        return null;
    }

    private generateTextField(selector: string, label: string, required: boolean) {
        return this.generateGenericField(selector, label, required, 'text');
    }

    private generateEmailField(selector: string, label: string, required: boolean) {
        const fieldData = this.generateGenericField(selector, label, required, 'email');
        fieldData.validators.push(Validators.pattern(emailRegex));
        return fieldData;
    }

    private generatePasswordField(selector: string, label: string, required: boolean) {
        return this.generateGenericField(selector, label, required, 'password');
    }

    private generateGenericField(selector: string, label: string, required: boolean, type: string) {
        return {
            selector,
            label: required ? `${label} *` : label,
            type,
            validators: required ?  [Validators.required] : [],
            errorMessages: {
                required: `${label} is required`,
                pattern: 'Please introduce a valid value',
                duplicated: `${label} already taken`
            }
        };
    }
}
