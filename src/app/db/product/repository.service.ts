import { ProductDocType } from '@/db/product/schema';
import { RxDBService } from '@/db/rxdb.service';
import { Injectable } from '@angular/core';
import { toast } from 'ngx-sonner';
import { RxDocumentData } from 'rxdb';
import { v4 as uuid } from 'uuid';
import { CategoryDocType } from '../category/schema';

interface IUpdateExistingProductParams {
  updatedCategory: string;
  updatedId: string;
  newQuantity: number;
  initialCategory: string;
  newCategory: string;
}

interface IProductParam {
  _data: ProductDocType;
}

@Injectable()
export class ProductRepositoryService {
  private readonly collectionName = 'products';
  constructor(private readonly rxdbService: RxDBService) { }

  async createProduct({ values }: { values: ProductDocType }) {
    const id = new Date().toISOString() + uuid();
    const productXCollection = this.rxdbService.getCollection<ProductDocType>(
      this.collectionName,
    );
    const categoryCollection =
      this.rxdbService.getCollection<CategoryDocType>('categories');

    const { category } = values;

    const properties = {
      ...values,
      id,
    };

    const categoryResult = categoryCollection.findOne({
      selector: {
        name: {
          $eq: category,
        },
      },
    });

    let existingProducts: string[] = [];
    const categoryDoc = await categoryResult.exec();

    if (categoryDoc?._data) {
      const productIds = categoryDoc._data.products;
      existingProducts = productIds ?? [];
    }

    const result = await productXCollection.insert(properties);

    if (!result._data) {
      throw new Error('Unable to create product');
    }

    const upserted = await categoryCollection.upsert({
      name: category,
      currentQuantity:
        values.quantity + (categoryDoc?._data.currentQuantity ?? 0),
      products: [result._data.id!, ...existingProducts],
    });

    if (!upserted._data) {
      throw new Error('Unable to create product');
    }

    return result;
  }

  private async handleUpdateExistingProduct(
    params: IUpdateExistingProductParams,
  ) {
    const {
      updatedCategory,
      updatedId,
      newQuantity,
      initialCategory,
      newCategory,
    } = params;

    const categoryCollection =
      this.rxdbService.getCollection<CategoryDocType>('categories');

    const category = updatedCategory;
    let categoryDoc = await categoryCollection
      .findOne({
        selector: {
          name: {
            $eq: category,
          },
        },
      })
      .exec();

    // NOTE: if category does not exist, create it
    if (!categoryDoc?._data) {
      categoryDoc = await categoryCollection.upsert({
        name: category,
        currentQuantity: newQuantity < 0 ? 0 : newQuantity,
        products: [updatedId],
      });
    }

    // NOTE: if category exists,but initial category is different from new category
    const isAddingToExistingCategory =
      initialCategory !== newCategory && !!categoryDoc;

    if (isAddingToExistingCategory) {
      // NOTE: remove product from old category
      const oldCategoryDoc = await categoryCollection
        .findOne({
          selector: {
            name: {
              $eq: initialCategory,
            },
          },
        })
        .exec();

      const products = (await oldCategoryDoc?.populate(
        'products',
      )) as IProductParam[];

      const filtered = products
        .filter((item) => item._data.id !== updatedId)
        .map((item) => item._data.id) as string[];

      // NOTE: update current quantity of old category
      const quantity = oldCategoryDoc!._data.currentQuantity - newQuantity;

      await categoryCollection.upsert({
        name: initialCategory,
        currentQuantity: quantity < 0 ? 0 : quantity,
        products: filtered ? filtered : [],
      });
    }

    return { categoryDoc, isAddingToExistingCategory };
  }

  async updateProduct({
    id,
    values,
    initialCategory,
  }: {
    id: string;
    values: ProductDocType;
    initialCategory: string;
  }) {
    const collection =
      this.rxdbService.getCollection<ProductDocType>('products');

    const categoryCollection =
      this.rxdbService.getCollection<CategoryDocType>('categories');

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
            const productDoc = await query.exec();
            const updated = await query.patch(values);
            if (!updated?._data) {
              return reject('failed');
            }

            const { categoryDoc, isAddingToExistingCategory } =
              await this.handleUpdateExistingProduct({
                updatedCategory: updated._data.category,
                updatedId: updated._data.id!,
                newQuantity: values.quantity,
                initialCategory,
                newCategory: values.category,
              });

            const populated = (await categoryDoc!.populate(
              'products',
            )) as IProductParam[];

            let products = populated.map((item) => item._data.id!);

            if (isAddingToExistingCategory) {
              products = [...products, updated._data.id!];
            }

            const currentCategoryQuantity = categoryDoc!._data.currentQuantity;
            const currentProductOldQuantity = productDoc!._data.quantity;
            const newCategoryQuantity = values.quantity;

            let finalProductsCount =
              currentCategoryQuantity -
              currentProductOldQuantity +
              newCategoryQuantity;

            // NOTE: if category exists,but initial category is different from new category then increast curent category quantity
            if (isAddingToExistingCategory) {
              finalProductsCount = currentCategoryQuantity + values.quantity;
            }

            const upserted = await categoryCollection.upsert({
              name: updated._data.category,
              currentQuantity: finalProductsCount,
              products,
            });

            if (!upserted._data) {
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

  async deleteProduct({ id }: { id: string }) {
    const collection = this.rxdbService.getCollection<ProductDocType>(
      this.collectionName,
    );
    const categoryCollection =
      this.rxdbService.getCollection<CategoryDocType>('categories');

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
      toast.warning('do you really want to delete this product?', {
        action: {
          label: 'Delete',
          onClick: async () => {
            const removed = await query.remove();
            if (!removed?._data) {
              return reject('failed');
            }

            const categoryDoc = await categoryCollection
              .findOne({
                selector: {
                  name: {
                    $eq: removed._data.category,
                  },
                },
              })
              .exec();
            const filtered = categoryDoc?._data.products.filter(
              (item) => item !== removed._data.id,
            );

            const upserted = await categoryCollection.upsert({
              name: removed._data.category,
              currentQuantity:
                categoryDoc!._data.currentQuantity - removed._data.quantity,
              products: filtered,
            });

            if (!upserted._data) {
              return reject('failed');
            }

            return resolve(removed._data);
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
