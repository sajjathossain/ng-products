import { ProductDocType } from '@/db/product.schema';
import { RxDBService } from '@/services/rxdb.service';
import { Component, Input, WritableSignal, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RxDocumentData } from 'rxdb';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-products-search',
  templateUrl: './search.component.html',
  imports: [ReactiveFormsModule],
})
export class ProductSearchComponent {
  searchTerm = signal('');
  debouncedSearchTerm$ = Observable<string>;
  enableDebounce = new BehaviorSubject(false);

  @Input({ required: true }) products!: WritableSignal<
    RxDocumentData<ProductDocType>[]
  >;

  constructor(private readonly rxdbService: RxDBService) { }

  toggleDbounce() {
    const enabled = this.enableDebounce.getValue();
    this.enableDebounce.next(!enabled);
  }

  async filetrProducts(term: string) {
    const collection =
      this.rxdbService.getCollection<ProductDocType>('products');
    const query = collection.find({
      sort: [{ createdAt: 'desc' }],
      selector: {
        name: {
          $regex: term,
        },
      },
    });

    const result = await query.exec();
    const mapped = result.map((item) => item._data);
    this.products.set(mapped);
  }

  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  handleSearch(term: string) {
    setTimeout(
      () => {
        this.filetrProducts(term);
      },
      this.enableDebounce.getValue() ? 2000 : 0,
    );
  }
}
