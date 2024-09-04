import {
  Component,
  ElementRef,
  Input,
  WritableSignal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { TRXProductType } from '../product-list.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { injectVirtualizer } from '@tanstack/angular-virtual';

@Component({
  selector: 'app-products-cards-view',
  standalone: true,
  template: `
    <div #scrollElement class="list scroll-container">
      <div
        style="position: relative; width: 100%;"
        [style.height.px]="virtualizer.getTotalSize()"
      >
        <div
          style="position: absolute; top: 0; left: 0; width: 100%;"
          style="position: relative; width: 100%;"
          [style.transform]="
            'translateY(' +
            (virtualizer.getVirtualItems()[0]
              ? virtualizer.getVirtualItems()[0].start
              : 0) +
            'px)'
          "
        >
          @for (row of virtualizer.getVirtualItems(); track row.index) {
            <app-product-card
              #virtualItem
              [attr.data-index]="row.index"
              [class.list-item-even]="row.index % 2 === 0"
              [class.list-item-odd]="row.index % 2 !== 0"
              style="position: absolute; top: 0; left: 0; width: 100%;"
              [style.height.px]="row.size"
              [style.transform]="'translateY(' + row.start + 'px)'"
              [product]="products()[row.index]"
            />
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      @apply h-full w-full md:hidden;
    }
    .scroll-container {
      @apply w-full h-full overflow-y-auto;
    }
  `,
  imports: [ProductCardComponent],
})
export class ProductsCardsViewComponent {
  @Input() products!: WritableSignal<TRXProductType[]>;
  scrollElement = viewChild<ElementRef<HTMLDivElement>>('scrollElement');

  virtualItems = viewChildren<ElementRef<HTMLDivElement>>('virtualItem');

  virtualizer = injectVirtualizer(() => ({
    scrollElement: this.scrollElement(),
    count: this.products().length,
    estimateSize: () => 400,
    overscan: 5,
  }));
}
