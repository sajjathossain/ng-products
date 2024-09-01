import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-container',
  template: `
    <span
      class="block items-center justify-between px-4 md:px-0 mx-0 md:mx-auto w-full md:w-2/3"
    >
      <ng-content />
    </span>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }
  `,
  imports: [NgTemplateOutlet],
})
export class ContainerComponent { }
