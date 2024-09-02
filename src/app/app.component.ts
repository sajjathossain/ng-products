import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { NgxSonnerToaster } from 'ngx-sonner';
import { RouterOutlet } from '@angular/router';
import { ContainerComponent, NavbarComponent } from '@/components/shared';
import { ProductsFormComponent } from './components/products/form/form.component';
import { ShowFormBtnComponent } from './components/shared/show-form-btn/show-form-btn.component';
import { RxDBService } from './services/rxdb.service';
import { ProductListComponent } from './components/products/product-list/product-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    ProductsFormComponent,
    ContainerComponent,
    ShowFormBtnComponent,
    ProductListComponent,
    NgxSonnerToaster,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'tiger-it-task';
  showForm = signal(false);
  @Output() toggle = new EventEmitter<boolean>();

  constructor(private rxdbService: RxDBService) { }

  ngOnInit(): void {
    this.rxdbService.initDB('tigerit-task');
  }

  toggleForm() {
    this.showForm.set(!this.showForm());
  }
}
