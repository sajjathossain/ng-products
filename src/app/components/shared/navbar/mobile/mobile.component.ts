import { TNavItem } from '@/lib/schemas';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  signal,
} from '@angular/core';
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

  @ViewChild('mobileNavSidebar', { read: TemplateRef })
  mobileNavSidebar!: TemplateRef<unknown>;
  @Output() templateEmmiter = new EventEmitter<TemplateRef<unknown>>();
  @Output() toggleFormEmmiter = new EventEmitter<MouseEvent>();

  showForm = signal(false);
  isOpen = signal(false);

  toggleForm(event: MouseEvent) {
    this.showForm.set(!this.showForm());
    this.toggleFormEmmiter.emit(event);
  }

  toggle() {
    if (this.isOpen()) {
      this.templateEmmiter.emit();
    }

    if (!this.isOpen()) {
      this.templateEmmiter.emit(this.mobileNavSidebar);
    }

    this.isOpen.set(!this.isOpen());
  }
}
