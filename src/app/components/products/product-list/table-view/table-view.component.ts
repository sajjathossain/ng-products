import { ProductDocType } from '@/db/product.schema';
import { DatePipe } from '@angular/common';
import { Component, Input, WritableSignal } from '@angular/core';
import {
  ColumnDef,
  FlexRenderDirective,
  createAngularTable,
  getCoreRowModel,
} from '@tanstack/angular-table';
import { RxDocumentData } from 'rxdb';

type TProductType = RxDocumentData<ProductDocType>;

const columns: ColumnDef<TProductType>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
  },
  {
    accessorKey: 'price',
    header: 'Total',
    cell: ({ row }) =>
      Number(row.getValue('quantity')) * Number(row.getValue('price')),
  },
  {
    header: 'Actions',
  },
];

@Component({
  standalone: true,
  selector: 'app-products-table-view',
  templateUrl: './table-view.component.html',
  imports: [FlexRenderDirective, DatePipe],
})
export class ProductsTableViewComponent {
  protected readonly datePipe = new DatePipe('en-US');
  @Input() products!: WritableSignal<TProductType[]>;

  table = createAngularTable(() => ({
    data: this.products(),
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
  }));
}
