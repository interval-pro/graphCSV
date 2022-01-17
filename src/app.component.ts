import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <basic-temp> 
    <div header class='header'>
        <custom-header>Header</custom-header>
    </div>
    <div body class='body'>
        <custom-main></custom-main>
    </div>
  </basic-temp>
`,
  styles: [`
    basic-temp {
      div.header {
          width: 100%;
          height: 100%;
      }
      div.body {
          width: 100%;
          height: 100%;
          padding: 2rem 0;
      }
    }
  `],
})
export class AppComponent {
  
  constructor() {}
}
