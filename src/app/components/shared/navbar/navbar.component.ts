import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MobileNavComponent } from './mobile/mobile.component';
import { TNavItem } from '@/lib/schemas';
import { ContainerComponent } from '../container/container.component';
import { DesktopNavComponent } from './desktop/desktop.component';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [
    RouterModule,
    MobileNavComponent,
    ContainerComponent,
    DesktopNavComponent,
  ],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  title = 'Products';

  navitems: TNavItem[] = [
    { title: 'Home', link: '/' },
    { title: 'About', link: '/about' },
  ];
}
