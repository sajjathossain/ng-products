import { ProductDocType } from '@/db/product/schema';
import { RxDBService } from '@/db/rxdb.service';
import { Component, Input } from '@angular/core';
import { RxDocumentData } from 'rxdb';
import { toast } from 'ngx-sonner';
import { CommunicationService } from '@/services/communication.service';
import { ProductActionButtonsComponent } from '../../action-buttons/action-buttons.component';

@Component({
  standalone: true,
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  imports: [ProductActionButtonsComponent],
  styles: `
    :host {
      @apply h-fit;
    }
  `,
})
export class ProductCardComponent {
  constructor(
    private rxdb: RxDBService,
    private communicationService: CommunicationService,
  ) {}

  private readonly collectionName = 'products';
  protected readonly num = Number;
  @Input({ required: true }) product!: RxDocumentData<ProductDocType>;

  udpateProduct(id: string) {
    this.communicationService.updateProductEmit(id);
  }

  async deleteProduct(id: string) {
    const collection = this.rxdb.getCollection<ProductDocType>(
      this.collectionName,
    );

    const query = collection.findOne({
      selector: {
        id: {
          $eq: id,
        },
      },
    });

    toast.warning('do you really want to delete this product?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          const removed = await query.remove();
          if (!removed?._data) {
            toast.error('Unable to delete product');
            return;
          }

          if (removed._data) {
            toast.success(`Product deleted. title: ${removed._data.name}`);
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => toast.success('good choice'),
      },
    });
  }
}
