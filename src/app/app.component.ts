import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { NgxSonnerToaster } from 'ngx-sonner';
import { RouterOutlet } from '@angular/router';
import { ContainerComponent, NavbarComponent } from '@/components/shared';
import { ProductsFormComponent } from './components/products/form/form.component';
import { ShowFormBtnComponent } from './components/shared/show-form-btn/show-form-btn.component';
import { RxDBService } from './db/rxdb.service';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { Title } from '@angular/platform-browser';

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
  showForm = signal(false);
  @Output() toggle = new EventEmitter<boolean>();

  constructor(
    private rxdbService: RxDBService,
    private readonly titleService: Title,
  ) {
    this.titleService.setTitle('NG Products');
  }

  ngOnInit(): void {
    this.rxdbService.initDB('ng-products');
  }
}
