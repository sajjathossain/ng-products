import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-container',
  template: ` <ng-content /> `,
  styles: `
    :host {
      @apply block relative px-4 md:px-0 mx-0 md:mx-auto w-full h-full md:w-2/3 overflow-y-auto md:overflow-y-visible;
    }
  `,
  imports: [NgTemplateOutlet],
})
export class ContainerComponent {}
