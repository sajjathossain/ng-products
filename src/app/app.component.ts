import { Component, EventEmitter, Output, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@/components/shared';
import { ProductsFormComponent } from './components/products/form/form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ProductsFormComponent],
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
