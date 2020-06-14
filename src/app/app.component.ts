import { Component } from '@angular/core';


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app',
  template: `
      <div class="app-container">
          <eka-navbar></eka-navbar>
          <eka-alert></eka-alert>
          <router-outlet></router-outlet>
      </div>
  `,
  styles: ['.app-container{ height: 100%; width: 100% }']
})
export class AppComponent {}
