import { ContainerComponent } from '@/components/shared';
import { RxDBService } from '@/db/rxdb.service';
import { DatePipe, KeyValuePipe, NgTemplateOutlet } from '@angular/common';
import { toast } from 'ngx-sonner';
import { Component, OnInit, effect, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  filter,
  first,
} from 'rxjs';
import { CommunicationService } from '@/services/communication.service';
import { IUpdateProductBehaviorSubject } from '@/lib/schemas/communication';
import { ProductDocType } from '@/db/product/schema';
import { RxDocument } from 'rxdb';
import { ProductRepositoryService } from '@/db/product/repository.service';

@Component({
  selector: 'app-products-form',
  templateUrl: './form.component.html',
  imports: [
    ContainerComponent,
    ReactiveFormsModule,
    NgTemplateOutlet,
    DatePipe,
  ],
  standalone: true,
  providers: [ProductRepositoryService, KeyValuePipe],
})
export class ProductsFormComponent implements OnInit {
  constructor(
    private rxdbService: RxDBService,
    private communicationService: CommunicationService,
    private productRepositoryService: ProductRepositoryService,
  ) {
    this.communicationService.formBehaviorSubject$.subscribe((data) => {
      if (!data) return null;

      if (data.toggle) return this.showForm.set(true);

      if (data.toggle === false) this.resetAndToggleForm();

      return null;
    });

    this.communicationService.productBehaviorSubject$.subscribe((data) => {
      if (!data) return null;

      if (data.updateId) {
        return this.updateProduct(data);
      }

      return null;
    });

    effect(() => {
      if (this.isDbReady()) {
        const products =
          this.rxdbService.getCollection<ProductDocType>('products');
        products
          .find({ sort: [{ createdAt: 'desc' }] })
          .$.subscribe((result) => {
            const obj = this.convertRxDocumentToCategoryObject(result);

            this.categories.set(obj);
          });
      }
    });
  }

  showCategorySelect = signal(false);
  keys = Object.keys;
  categories = signal<Record<string, number>>({});

  protected readonly datePipe = new DatePipe('en-US');

  productForm = new FormGroup(
    {
      name: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
        nonNullable: true,
      }),
      category: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
        nonNullable: true,
      }),
      price: new FormControl(1, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1)],
      }),
      description: new FormControl('', {
        nonNullable: true,
      }),
      quantity: new FormControl(1, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1)],
        updateOn: 'blur',
      }),
      createdAt: new FormControl(
        this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(3)],
        },
      ),
    },
    {
      updateOn: 'blur',
    },
  );
  protected showForm = signal(false);
  private isDbReady = signal(false);
  protected productId = signal<string | null>(null);
  protected input$ = new BehaviorSubject<string>('');
  protected maxQuantity$ = new BehaviorSubject<number>(10);

  ngOnInit(): void {
    this.rxdbService.dataBaseReady$
      .pipe(
        filter((ready) => !!ready),
        first(),
      )
      .subscribe(() => this.isDbReady.set(true));

    this.input$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => {
        this.filterByCategory(term);
      });
  }

  resetAndToggleForm(params?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values: RxDocument<any>;
    id: string | null;
    toggle: boolean;
  }) {
    this.productForm.reset(params?.values ?? {});
    this.productId.set(params?.id ?? null);
    this.showForm.set(params?.toggle ?? false);
  }

  async handleUpdate() {
    const values = {
      ...this.productForm.value,
      name: this.productForm.value.name ?? 'default',
      price: this.productForm.value.price ?? 1,
      createdAt: this.productForm.value.createdAt ?? new Date().toISOString(),
    } as ProductDocType;

    const result = await this.productRepositoryService.updateProduct({
      id: this.productId()!,
      values,
    });

    if (result === 'failed' || result === 'canceled') {
      toast.error(`Product update ${result}`);
    } else {
      toast.success(`Product updated.`);
    }

    return this.resetAndToggleForm();
  }

  async handleSubmit() {
    const values = {
      ...this.productForm.value,
      name: this.productForm.value.name!,
      price: this.productForm.value.price!,
      createdAt: this.productForm.value.createdAt ?? new Date().toISOString(),
      category: this.productForm.value.category!,
      quantity: this.productForm.value.quantity!,
    };

    const result = await this.productRepositoryService.createProduct({
      productForm: this.productForm,
      values,
    });

    if (result) {
      this.productForm.reset();
      toast.success('Product created successfully!', {
        dismissible: true,
        duration: 1000,
      });
    }

    if (!result) {
      toast.error('Unable to create product');
    }

    this.showForm.set(false);
  }

  convertToHTMLDate(date: string | Date | number) {
    const parsed = new Date(date);
    const piped = this.datePipe.transform(parsed, 'yyyy-MM-dd');
    return piped;
  }

  async updateProduct(data: IUpdateProductBehaviorSubject) {
    if (!data.updateId) return;
    const collection =
      this.rxdbService.getCollection<ProductDocType>('products');

    const query = collection.findOne({
      selector: {
        id: {
          $eq: data.updateId,
        },
      },
    });

    const findOne = await query.exec();
    const product = findOne?._data;
    if (!product) {
      return toast.error('Unable to find product');
    }

    this.resetAndToggleForm({
      values: {
        ...product,
        createdAt: this.convertToHTMLDate(product.createdAt),
      },
      id: product.id!,
      toggle: true,
    });
    return findOne;
  }

  convertRxDocumentToCategoryObject(data: RxDocument<ProductDocType>[]) {
    const map = new Map<string, number>();
    data.forEach((item) => {
      const quantity = map.get(item.category) ?? 0;
      map.set(item.category, quantity + item.quantity);
    });

    const obj = Object.fromEntries(map);
    return obj;
  }

  async filterByCategory(category: string) {
    const collection =
      this.rxdbService.getCollection<ProductDocType>('products');
    const query = collection.find({
      selector: {
        category: {
          $regex: `^.*${category}.*$`,
          $options: 'i',
        },
      },
      sort: [{ createdAt: 'desc' }],
    });

    const result = await query.exec();
    const shouldShow = result.length > 0 && this.input$.getValue().length > 0;
    this.showCategorySelect.set(shouldShow);
    const mapped = this.convertRxDocumentToCategoryObject(result);
    const current: number | undefined = mapped[category.trim()];
    this.categories.set(mapped);
    this.maxQuantity$.next(10 - (current ?? 0));
  }

  selectCategory(category: string) {
    this.productForm.get('category')?.setValue(category);
    this.input$.next(category);
    this.showCategorySelect.set(false);
  }

  handleInput(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    this.input$.next(term);
  }

  toggleForm() {
    const toggle = !this.showForm();
    this.communicationService.toggleFormEmit(toggle);
  }
}
