import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MobileNavComponent } from './mobile/mobile.component';
import { TNavItem } from '@/lib/schemas';
import { ContainerComponent } from '../container/container.component';
import { DesktopNavComponent } from './desktop/desktop.component';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [
    RouterModule,
    NgTemplateOutlet,
    MobileNavComponent,
    ContainerComponent,
    DesktopNavComponent,
  ],
  styles: `
    :host {
      @apply grid grid-rows-[1fr_100%];
    }
  `,
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  title = 'Products';

  @Output() toggleForm = new EventEmitter<boolean>();

  navitems: TNavItem[] = [
    { title: 'Home', link: '/' },
    { title: 'About', link: '/about' },
  ];
}
