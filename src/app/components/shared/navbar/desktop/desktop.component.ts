import { Component } from '@angular/core';
import { ContainerComponent } from '../../container/container.component';
import { RouterModule } from '@angular/router';
import { ThemeSwitcherComponent } from '../../theme-switcher/theme-switcher.component';

@Component({
  standalone: true,
  selector: 'app-desktop-nav',
  templateUrl: './desktop.component.html',
  imports: [ContainerComponent, RouterModule, ThemeSwitcherComponent],
})
export class DesktopNavComponent { }
