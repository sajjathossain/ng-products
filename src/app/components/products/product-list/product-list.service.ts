import { ProductDocType } from '@/db/product.schema';
import { RxDBService } from '@/services/rxdb.service';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { RxDocumentData } from 'rxdb';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ProductListService {
  private readonly collectionName = 'products';
  constructor(private readonly rxdbService: RxDBService) { }

  async createProduct({
    productForm,
    values,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    productForm: FormGroup<any>;
    values: ProductDocType;
  }) {
    const id = new Date().toISOString() + uuid();
    const productXCollection = this.rxdbService.getCollection<ProductDocType>(
      this.collectionName,
    );
    const properties = {
      ...values,
      name: productForm.value.name ?? 'default',
      price: productForm.value.price ?? 1,
      createdAt: productForm.value.createdAt ?? new Date().toISOString(),
      id,
    };
    const result = await productXCollection.insert(properties);

    if (!result._data) {
      throw new Error('Unable to create product');
    }

    return result;
  }

  async updateProduct({
    id,
    values,
  }: {
    id: string;

    values: ProductDocType;
  }) {
    const collection =
      this.rxdbService.getCollection<ProductDocType>('products');

    const query = collection.findOne({
      selector: {
        id: {
          $eq: id,
        },
      },
    });

    const res = await new Promise<
      RxDocumentData<ProductDocType> | 'failed' | 'canceled'
    >((resolve, reject) => {
      toast.warning('do you really want to update this product?', {
        action: {
          label: 'Update',
          onClick: async () => {
            const updated = await query.patch(values);
            if (!updated?._data) {
              return reject('failed');
            }

            const result = updated._data;
            resolve(result);
          },
        },
        cancel: {
          label: 'Cancel',
          onClick: () => {
            reject('canceled');
          },
        },
      });
    });

    return res;
  }
}
