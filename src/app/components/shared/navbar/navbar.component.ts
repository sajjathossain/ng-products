import { Component, TemplateRef, ViewChild, signal } from '@angular/core';
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

  navitems: TNavItem[] = [
    { title: 'Home', link: '/' },
    { title: 'About', link: '/about' },
  ];

  showForm = signal(false);

  @ViewChild('mobileNavSidebar', { read: NgTemplateOutlet })
  mobileNavSidebar!: TemplateRef<unknown>;

  assignTemplate(template: TemplateRef<unknown>) {
    this.mobileNavSidebar = template;
  }

  toggleForm(_event: MouseEvent) {
    console.log({ _event });
    this.showForm.set(!this.showForm());
  }
}
