import { Component, Input } from '@angular/core';
import { ContainerComponent } from '../../container/container.component';
import { TNavItem } from '@/lib/schemas';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-desktop-nav',
  templateUrl: './desktop.component.html',
  imports: [ContainerComponent, RouterModule],
})
export class DesktopNavComponent {
  @Input({ required: true }) navitems: TNavItem[] = [];
}
