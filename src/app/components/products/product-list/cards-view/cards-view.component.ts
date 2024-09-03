import { Component, Input, WritableSignal } from '@angular/core';
import { TRXProductType } from '../product-list.component';
import { ProductCardComponent } from './product-card/product-card.component';

@Component({
  selector: 'app-products-cards-view',
  standalone: true,
  template: `
    @for (product of products(); track $index) {
      <app-product-card [product]="product" />
    }
  `,
  styles: `
    :host {
      @apply grid grid-cols-1 lg:grid-cols-2 gap-4 mb-20 md:mb-0 place-self-center overflow-hidden md:hidden;
    }
  `,
  imports: [ProductCardComponent],
})
export class ProductsCardsViewComponent {
  @Input() products!: WritableSignal<TRXProductType[]>;
}
