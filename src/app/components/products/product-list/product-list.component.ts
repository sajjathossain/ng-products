import { ProductDocType } from '@/db/product.schema';
import { RxDBService } from '@/services/rxdb.service';
import { Component, OnInit, effect, signal } from '@angular/core';
import { RxDocumentData } from 'rxdb';
import { filter, first } from 'rxjs';
import { ProductSearchComponent } from '../search/search.component';
import { ProductsCardsViewComponent } from './cards-view/cards-view.component';
import { ProductsTableViewComponent } from './table-view/table-view.component';
import { CommunicationService } from '@/services/communication.service';
import { ProductListService } from './product-list.service';
import { toast } from 'ngx-sonner';

export type TRXProductType = RxDocumentData<ProductDocType>;

@Component({
  standalone: true,
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  imports: [
    ProductSearchComponent,
    ProductsTableViewComponent,
    ProductsCardsViewComponent,
  ],
  providers: [ProductListService],
})
export class ProductListComponent implements OnInit {
  private isDbReady = signal(false);
  products = signal<TRXProductType[]>([]);
  private collectionName = 'products';

  constructor(
    private rxdbService: RxDBService,
    private readonly communicationService: CommunicationService,
    private readonly productListService: ProductListService,
  ) {
    effect(() => {
      if (this.isDbReady()) {
        const products = this.rxdbService.getCollection<ProductDocType>(
          this.collectionName,
        );
        products
          .find({ sort: [{ createdAt: 'desc' }] })
          .$.subscribe((result) => {
            const mapped = result.map((item) => item._data);
            this.products.set(mapped);
          });
      }
    });

    this.communicationService.productBehaviorSubject$.subscribe((data) => {
      if (!data) return null;

      if (data.deleteId) {
        return this.deleteProduct(data.deleteId);
      }

      return null;
    });
  }

  ngOnInit(): void {
    this.rxdbService.dataBaseReady$
      .pipe(
        filter((ready) => !!ready),
        first(),
      )
      .subscribe(() => this.isDbReady.set(true));
  }

  async deleteProduct(id: string) {
    const result = await this.productListService.deleteProduct({ id });

    switch (result) {
      case 'canceled':
        toast.error('Unable to delete product');
        return;
      case 'failed':
        toast.error('Unable to delete product');
        return;
    }

    toast.success(`Product deleted. title: ${result.name}`);
  }
}
