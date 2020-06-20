import { AfterViewInit, ChangeDetectorRef, ComponentFactoryResolver, Directive, Input, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldInterface } from './field.interface';
import { InputComponent } from './input';
import { InputTypes } from './_services';

const typesMap = {
    [InputTypes.text]:      InputComponent,
    [InputTypes.email]:     InputComponent,
    [InputTypes.password]:  InputComponent,
};

@Directive({
  selector: '[ekaDynamicInput]',
})
export class DynamicInputDirective implements AfterViewInit{
    @Input() form: FormGroup;
    @Input() selector: string;

    constructor(
        private viewContainerRef: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private cdr: ChangeDetectorRef
    ) {

    }

    ngAfterViewInit(): void {
        this.viewContainerRef.clear();
        const component = typesMap[this.type];
        if (!component) {
            console.error('No component specified');
            return;
        }

        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
        const componentRef = this.viewContainerRef.createComponent(componentFactory);
        (componentRef.instance as FieldInterface).form = this.form;
        (componentRef.instance as FieldInterface).selector = this.selector;
        this.cdr.detectChanges();
    }

    private get type(): string {
        return (this.form.get(this.selector) as any).data.type;
    }
}
