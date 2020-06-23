import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, Input, ViewContainerRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldInterface } from '../field.interface';
import { InputTypes } from '../_services';
import { InputComponent } from './input.component';

const typesMap = {
    [InputTypes.text]:      InputComponent,
    [InputTypes.email]:     InputComponent,
    [InputTypes.password]:  InputComponent,
};

@Component({
  selector: 'eka-gen-input',
  template: '<ng-template #container></ng-template>'
})
export class GenericInputComponent implements AfterViewInit, FieldInterface{
    @Input() form: FormGroup;
    @Input() selector: string;
    @ViewChild('container', {read: ViewContainerRef}) container;

    constructor(
        // private viewContainerRef: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private cdr: ChangeDetectorRef
    ) {

    }

    ngAfterViewInit(): void {
        this.container.clear();
        const component = typesMap[this.type];
        if (!component) {
            console.error('No component specified');
            return;
        }

        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
        const componentRef = this.container.createComponent(componentFactory);
        (componentRef.instance as FieldInterface).form = this.form;
        (componentRef.instance as FieldInterface).selector = this.selector;
        this.cdr.detectChanges();
    }

    private get type(): string {
        return (this.form.get(this.selector) as any).data.type;
    }
}
