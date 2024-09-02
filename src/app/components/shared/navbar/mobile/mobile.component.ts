import { TNavItem } from '@/lib/schemas';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContainerComponent } from '../../container/container.component';
import { ThemeSwitcherComponent } from '../../theme-switcher/theme-switcher.component';
import { ShowFormBtnComponent } from '../../show-form-btn/show-form-btn.component';

@Component({
  standalone: true,
  templateUrl: './mobile.component.html',
  selector: 'app-mobile-nav',
  imports: [
    RouterModule,
    ContainerComponent,
    ThemeSwitcherComponent,
    ShowFormBtnComponent,
  ],
})
export class MobileNavComponent {
  @Input({
    required: true,
  })
  navitems: TNavItem[] = [];

  @Output() showForm = new EventEmitter<boolean>();
}
