import { Component, Input } from '@angular/core';

@Component({
  selector: 'gs-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})

export class GsButtonComponent {
  @Input('color') color: string = 'blue';
  @Input('size') size: string = 'm';
  @Input('disabled') disabled: boolean = false;

  constructor() {}
}
