import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MobileNavComponent } from './mobile/mobile.component';
import { TNavItem } from '@/lib/types';
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

  navitems: TNavItem[] = [
    { title: 'Home', link: '/' },
    { title: 'About', link: '/about' },
  ];
}
