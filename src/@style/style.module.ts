import { NgModule } from '@angular/core';
import { BasicTemplateComponent } from './basic-temp/basic-temp.component';

const TEMPLATES = [
    BasicTemplateComponent,
];

@NgModule({
    imports: [ ],
    declarations: [
        ...TEMPLATES,
    ],
    exports: [
        ...TEMPLATES,
    ],
})
export class StyleModule { }
