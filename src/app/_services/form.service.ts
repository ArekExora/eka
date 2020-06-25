import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { InputTypes } from '@app/_models';


export class EkaFieldData {
    selector: string;
    label: string;
    type?: InputTypes;
    value?: string;
    validators?: ValidatorFn[];
    errorMessages?: { [key: string]: string };
    hint?: string;
}

class EkaFormControl extends FormControl {
    data?: EkaFieldData;
}

class EkaFormData {
    heading?: string;
    primaryText: string;
    secondaryText?: string;
    condensed?: boolean;
}

export class EkaFormGroup extends FormGroup {
    data?: EkaFormData;
}

class EkaFormModel {
    data: EkaFormData;
    fields: string[];
}

const nameRegex = /^t.*/;
const passwordRegex = /^a.*/;
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

@Injectable({ providedIn: 'root' })
export class FormService {

    constructor(
        private formBuilder: FormBuilder,
    ) { }

    generateForm(formCode: string): EkaFormGroup {
        const formModel = this.getDataForForm(formCode);
        const fieldsData = formModel.fields.reduce((fData, f) => {
            const d = this.getDataForField(f);
            fData[d.selector] = this.createCustomControl(d);
            return fData;
        }, {});

        const form: EkaFormGroup = this.formBuilder.group(fieldsData);
        form.data = formModel.data;
        return form;
    }

    private createCustomControl(data: EkaFieldData): EkaFormControl {
        const control: EkaFormControl = this.formBuilder.control(data.value, data.validators);
        control.data = data;
        return control;
    }

    private getDataForForm(formCode: string): EkaFormModel {
        const dataMap = {
            login: {
                data: {
                    heading: 'Login',
                    primaryText: 'Login'
                },
                fields: ['username', 'password']
            },
            register: {
                data: {
                    heading: 'Register',
                    primaryText: 'Register'
                },
                fields: ['reg_username', 'reg_email', 'reg_password1', 'reg_password2']
            },
            room_search: {
                data: {
                    primaryText: 'Search',
                    condensed: true
                },
                fields: ['room_filter_name', 'room_filter_game', 'room_filter_owner']
            }
        };

        const data = dataMap[formCode];
        if (data) {
            return data;
        }
        throw new Error(`Formcode ${formCode} not found`);
    }

    private getDataForField(fieldCode: string): EkaFieldData {
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
            },
            room_filter_name: {
                selector: 'name',
                label: 'Name',
                type: InputTypes.text,
                value: '',
                validators: [],
                errorMessages: {}
            },
            room_filter_owner: {
                selector: 'owner',
                label: 'Owner',
                type: InputTypes.text,
                value: '',
                validators: [],
                errorMessages: {}
            },
            room_filter_game: {
                selector: 'game',
                label: 'Game',
                type: InputTypes.text,
                value: '',
                validators: [],
                errorMessages: {}
            }
        };

        const data = dataMap[fieldCode];
        if (data) {
            return data;
        }
        throw new Error(`Fieldcode ${fieldCode} not found`);
    }

}
