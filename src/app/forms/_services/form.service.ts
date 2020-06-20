import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn } from '@angular/forms';

export enum InputTypes {
    text = 'text',
    email = 'email',
    password = 'password'
}

export class EkaFormField {
    selector: string;
    label: string;
    type?: InputTypes;
    value?: string;
    validators?: ValidatorFn[];
    errorMessages?: { [key: string]: string };
    hint?: string;
}

export class EkaFormModel {
    heading?: string;
    primaryText: string;
    secondaryText?: string;
    fields: string[];
}

export class EkaFormData {
    heading?: string;
    form: FormGroup;
    primaryText: string;
    secondaryText?: string;
}

const nameRegex = /^t.*/;
const passwordRegex = /^a.*/;
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

@Injectable()
export class FormService {

    constructor(
        private formBuilder: FormBuilder,
    ) { }

    parseData(data: EkaFormModel): EkaFormData {
        const { heading, primaryText, secondaryText, fields } = data;
        const formData = fields.reduce((fData, f) => {
            const d = this.getDataForField(f);
            fData[d.selector] = this.createCustomControl(d);
            return fData;
        }, {});

        return {
            heading,
            primaryText,
            secondaryText,
            form: this.formBuilder.group(formData)
        };
    }

    private createCustomControl(data: EkaFormField): FormControl {
        const control: FormControl = this.formBuilder.control(data.value, data.validators);
        (control as any).data = data;
        return control;
    }

    private getDataForField(fieldCode: string): EkaFormField {
        const dataMap = {
            username: {
                selector: 'username',
                label: 'Username',
                type: InputTypes.text,
                value: '',
                validators: [Validators.required],
                errorMessages: {
                    required: 'Username is required'
                }
            },
            reg_username: {
                selector: 'username',
                label: 'Username',
                type: InputTypes.text,
                value: '',
                validators: [Validators.required, Validators.pattern(nameRegex)],
                errorMessages: {
                    required: 'Username is required',
                    pattern: 'Please introduce a valid name',
                    duplicated: 'Username already taken'
                },
                hint: 'Must begin with "t".'
            },
            reg_email: {
                selector: 'email',
                label: 'Email',
                type: InputTypes.email,
                value: '',
                validators: [Validators.required, Validators.pattern(emailRegex)],
                errorMessages: {
                    required: 'Email is required',
                    pattern: 'Please introduce a valid email',
                    duplicated: 'Email already taken'
                }
            },
            password: {
                selector: 'password',
                label: 'Password',
                type: InputTypes.password,
                value: '',
                validators: [Validators.required],
                errorMessages: {
                    required: 'Password is required'
                }
            },
            reg_password1: {
                selector: 'password',
                label: 'Password',
                type: InputTypes.password,
                value: '',
                validators: [Validators.required, Validators.pattern(passwordRegex)],
                errorMessages: {
                    required: 'Password is required',
                    pattern: 'Please introduce a valid password'
                },
                hint: 'Must begin with "a".'
            },
            reg_password2: {
                selector: 'password2',
                label: 'Password confirmation',
                type: InputTypes.password,
                value: '',
                validators: [Validators.required, Validators.pattern(passwordRegex)],
                errorMessages: {
                    required: 'Password confirmation is required',
                    pattern: 'Please introduce a valid password',
                    unmatched: 'Does not match first Password'
                },
                hint: 'Must begin with "a".'
            }
        };

        const data = dataMap[fieldCode];
        if (data) {
            return data;
        }
        throw new Error(`Fieldcode ${fieldCode} not found`);
    }

}
