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
    columnHelper.accessor('name', {
      header: 'Name',
    }),
    columnHelper.accessor('category', {
      header: 'Category',
    }),
    columnHelper.accessor('quantity', {
      header: 'Quantity',
    }),
    columnHelper.accessor('price', {
      header: 'Total',
      cell: ({ row }) =>
        Number(row.getValue('quantity')) * Number(row.getValue('price')),
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
    debugTable: true,
  }));
}
