import { Component, EventEmitter, Output, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContainerComponent, NavbarComponent } from '@/components/shared';
import { ProductsFormComponent } from './components/products/form/form.component';
import { ShowFormBtnComponent } from './components/shared/show-form-btn/show-form-btn.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    ProductsFormComponent,
    ContainerComponent,
    ShowFormBtnComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'tiger-it-task';
  showForm = signal(false);
  @Output() toggle = new EventEmitter<boolean>();

  toggleForm() {
    this.showForm.set(!this.showForm());
  }
}
