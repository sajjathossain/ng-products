import { ProductDocType } from '@/db/product.schema';
import { RxDBService } from '@/services/rxdb.service';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FormService {
  private readonly collectionName = 'products';
  constructor(private rxdbService: RxDBService) {}

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
}
