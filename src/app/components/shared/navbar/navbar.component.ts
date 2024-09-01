import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MobileNavComponent } from './mobile/mobile.component';
import { TNavItem } from '@/lib/schemas';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [RouterModule, MobileNavComponent],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  title = 'Products';

  _navitems: TNavItem[] = [
    { title: 'Home', link: '/' },
    { title: 'New', link: '/create' },
    { title: 'About', link: '/about' },
  ];
}
