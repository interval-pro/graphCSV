import { Component, Input } from '@angular/core';

@Component({
  selector: 'gs-select',
  templateUrl: './gs-select.component.html',
  styleUrls: ['./gs-select.component.scss']
})

export class GsSelectComponent {
  @Input('placeholder') placeholder: string = '';
  constructor() {}
}
