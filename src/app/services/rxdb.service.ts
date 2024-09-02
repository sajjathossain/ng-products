import { Injectable, signal } from '@angular/core';
import { RxCollection, RxDatabase, addRxPlugin, createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { isDevMode } from '@angular/core';
import { productSchema } from '@/db/product.schema';
import { BehaviorSubject } from 'rxjs';

const loadPlugins = async () => {
  addRxPlugin(RxDBQueryBuilderPlugin);
  addRxPlugin(RxDBUpdatePlugin);

  if (isDevMode()) {
    addRxPlugin(RxDBDevModePlugin);
  }
};

loadPlugins();

@Injectable({
  providedIn: 'root',
})
export class RxDBService {
  private rxdb!: RxDatabase;
  public isDataBaseReady$ = signal(false);
  private dataBaseReadySubj = new BehaviorSubject<boolean>(false);
  public dataBaseReady$ = this.dataBaseReadySubj.asObservable();

  public getCollection<T>(collectionName: string): RxCollection<T> {
    if (!this.rxdb) {
      throw new Error('Database not initialized');
    }

    return this.rxdb[collectionName];
  }

  public async initDB(dbName: string) {
    if (this.rxdb && this.rxdb.name === dbName && !this.rxdb.destroyed) {
      return this.rxdb;
    }

    this.rxdb = await createRxDatabase({
      name: dbName,
      storage: getRxStorageDexie(),
      ignoreDuplicate: true,
    });

    await this.rxdb.addCollections({
      products: {
        schema: productSchema,
      },
    });

    this.dataBaseReadySubj.next(true);

    return this.rxdb;
  }
}
