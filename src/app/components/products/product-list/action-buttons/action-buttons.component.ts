import { CommunicationService } from '@/services/communication.service';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-action-buttons',
  standalone: true,
  template: `
    <button (click)="udpateProduct(id!)" class="btn btn-primary">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        storke="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="currentColor">
          <path
            d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157l3.712 3.712l1.157-1.157a2.625 2.625 0 0 0 0-3.712m-2.218 5.93l-3.712-3.712l-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32z"
          />
          <path
            d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5z"
          />
        </g>
      </svg>
    </button>
    <button (click)="deleteProduct(id!)" class="btn btn-error">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        stroke="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="m14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21q.512.078 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48 48 0 0 0-3.478-.397m-12 .562q.51-.088 1.022-.165m0 0a48 48 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a52 52 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a49 49 0 0 0-7.5 0"
        />
      </svg>
    </button>
  `,
  styles: `
    :host {
      @apply flex gap-2 items-center;
    }
  `,
})
export class ProductActionButtonsComponent {
  @Input() id!: string;
  constructor(private communicationService: CommunicationService) { }

  udpateProduct(id: string) {
    this.communicationService.updateProductEmit(id);
  }

  deleteProduct(id: string) {
    console.log({ id });
    this.communicationService.deleteProductEmit(id);
  }
  /*


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
  } */
}
