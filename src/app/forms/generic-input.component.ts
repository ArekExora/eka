import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { InputTypes } from '@app/_models';
import { FieldInterface } from './field.interface';
import { InputTextComponent } from './input-text';

const typesMap = {
    [InputTypes.text]:      InputTextComponent,
    [InputTypes.email]:     InputTextComponent,
    [InputTypes.password]:  InputTextComponent,
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
