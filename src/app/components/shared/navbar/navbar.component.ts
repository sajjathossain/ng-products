import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  title = 'Products';
  _isOpen = signal(false);

  _navitems = [
    { title: 'Home', link: '/' },
    { title: 'About', link: '/about' },
    { title: 'New', link: '/create' },
  ];

  _toggle() {
    this._isOpen.set(!this._isOpen());
  }
}
