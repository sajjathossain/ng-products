import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-container',
  template: `
    <span
      class="block relative px-4 md:px-0 mx-0 md:mx-auto w-full md:w-2/3 h-full"
    >
      <ng-content />
    </span>
  `,
  styles: `
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
    }
  `,
  imports: [NgTemplateOutlet],
})
export class ContainerComponent {}
