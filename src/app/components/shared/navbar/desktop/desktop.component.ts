import { Component, Input } from '@angular/core';
import { ContainerComponent } from '../../container/container.component';
import { TNavItem } from '@/lib/schemas';
import { RouterModule } from '@angular/router';
import { ThemeSwitcherComponent } from '../../theme-switcher/theme-switcher.component';

@Component({
  standalone: true,
  selector: 'app-desktop-nav',
  templateUrl: './desktop.component.html',
  imports: [ContainerComponent, RouterModule, ThemeSwitcherComponent],
})
export class DesktopNavComponent {
  @Input({ required: true }) navitems: TNavItem[] = [];
}
