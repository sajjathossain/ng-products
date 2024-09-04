import { ProductDocType } from '@/db/product/schema';
import { DatePipe } from '@angular/common';
import { Component, Input, WritableSignal } from '@angular/core';
import {
  FlexRenderComponent,
  FlexRenderDirective,
  createAngularTable,
  createColumnHelper,
  getCoreRowModel,
} from '@tanstack/angular-table';
import { RxDocumentData } from 'rxdb';
import { ProductActionButtonsComponent } from '../action-buttons/action-buttons.component';

type TProductType = RxDocumentData<ProductDocType>;

const columnHelper = createColumnHelper<TProductType>();

@Component({
  standalone: true,
  selector: 'app-products-table-view',
  templateUrl: './table-view.component.html',
  imports: [FlexRenderDirective, DatePipe, ProductActionButtonsComponent],
})
export class ProductsTableViewComponent {
  protected readonly datePipe = new DatePipe('en-US');
  @Input() products!: WritableSignal<TProductType[]>;

  deaultColumns = [
    columnHelper.accessor('image', {
      header: 'Image',
      cell: ({ cell }) => {
        const value = cell.getValue();
        return `
          <div class="avatar">
            <div class="mask mask-squircle h-12 w-12 ${!value?.length ? 'bg-base-200 group-hover:bg-base-300' : ''}">
              <img
                src="${value?.length ? value : '/default.png'}"
                alt="Avatar Tailwind CSS Component" />
            </div>
          </div>
        `;
      },
    }),
    columnHelper.accessor('name', {
      header: 'Name',
    }),
    columnHelper.accessor('category', {
      header: 'Category',
    }),
    columnHelper.accessor('quantity', {
      header: 'Quantity',
      cell: ({ cell }) => `
        <p class="text-end">${cell.getValue()}</p>
      `,
    }),
    columnHelper.accessor('price', {
      id: 'unitPrice',
      header: 'Unit Price',
      cell: ({ cell }) => `
        <p class="text-end">${cell.getValue()}</p>
      `,
    }),
    columnHelper.accessor('price', {
      header: 'Total',
      cell: ({ row }) => `
        <p class="text-end">${Number(row.getValue('quantity')) * Number(row.getValue('price'))}</p>
      `,
      footer: () => {
        const total = this.products().reduce((acc, product) => {
          return acc + product.quantity * product.price;
        }, 0);
        return `<p class="text-end">Total Price: ${total}</p>`;
      },
    }),
    columnHelper.display({
      id: 'id',
      header: 'Actions',
      cell: (info) => {
        const id = info.row.original.id;
        return new FlexRenderComponent(ProductActionButtonsComponent, {
          id,
        });
      },
    }),
  ];

  table = createAngularTable(() => ({
    data: this.products(),
    columns: this.deaultColumns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: 10,
    debugTable: true,
  }));
}
