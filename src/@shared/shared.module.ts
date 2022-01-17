import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GsButtonComponent } from './components/button/button.component';
import { GsSelectComponent } from './components/select/gs-select.component';

const COMPONENTS = [
  GsButtonComponent,
  GsSelectComponent,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  exports: [
    ...COMPONENTS,
  ],
  imports: [
    CommonModule,
  ],
  providers: [],
})
export class SharedModule { }
