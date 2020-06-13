import { Component } from '@angular/core';


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app',
  template: `
      <div>
          <eka-navbar></eka-navbar>
          <eka-alert></eka-alert>
          <router-outlet></router-outlet>
      </div>
  `
})
export class AppComponent {}
