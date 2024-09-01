import { TNavItem } from '@/lib/schemas';
import { Component, Input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContainerComponent } from '../../container/container.component';

@Component({
  standalone: true,
  templateUrl: './mobile.component.html',
  selector: 'app-mobile-nav',
  imports: [RouterModule, ContainerComponent],
})
export class MobileNavComponent {
  @Input({
    required: true,
  })
  navitems: TNavItem[] = [];
  _isOpen = signal(false);

  _toggle() {
    this._isOpen.set(!this._isOpen());
  }
}
