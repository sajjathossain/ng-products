import { ProductDocType } from '@/db/product.schema';
import { Component, Input } from '@angular/core';
import { RxDocumentData } from 'rxdb';

@Component({
  standalone: true,
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  @Input({ required: true }) product!: RxDocumentData<ProductDocType>;
}
